import os
import shutil
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from dependencies.auth import get_current_user
from models.user import User
from models.project import Project
from models.document import Document
from models.notification import Notification
from schemas.project import DocumentResponse, DocumentReviewRequest

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get("/review-list", summary="Get all student documents for supervisor review")
def get_documents_for_review(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if current_user.role == "supervisor":
        docs = db.scalars(
            select(Document)
            .join(Project, Document.project_id == Project.id)
            .where(
                (Project.supervisor_id == current_user.id) | (Project.supervisor_name == current_user.full_name)
            )
            .order_by(Document.created_at.desc())
        ).all()
    elif current_user.role == "student":
        docs = db.scalars(
            select(Document).where(Document.student_id == current_user.id).order_by(Document.created_at.desc())
        ).all()
    else:  # Coordinator sees all
        docs = db.scalars(select(Document).order_by(Document.created_at.desc())).all()

    result = []
    for d in docs:
        p = db.get(Project, d.project_id)
        result.append({
            "id": d.id,
            "project_id": d.project_id,
            "student_id": d.student_id,
            "file_name": d.file_name,
            "file_size": d.file_size,
            "file_format": d.file_format,
            "doc_type": d.doc_type,
            "version": d.version,
            "status": d.status,
            "supervisor_comment": d.supervisor_comment,
            "created_at": d.created_at.isoformat() if hasattr(d.created_at, "isoformat") else str(d.created_at),
            "group_name": p.group_name if p else "Group",
            "project_title": p.title if p else "Project",
            "student_name": p.student_name if p else "Student",
        })
    return result


@router.get("/project/{project_id}", response_model=List[DocumentResponse], summary="Get documents for a project")
def get_project_documents(
    project_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    docs = db.scalars(select(Document).where(Document.project_id == project_id).order_by(Document.created_at.desc())).all()
    return docs


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED, summary="Upload project deliverable")
async def upload_document(
    project_id: Annotated[int, Form()],
    doc_type: Annotated[str, Form()],
    version: Annotated[str, Form()],
    file: UploadFile = File(...),
    current_user: Annotated[User, Depends(get_current_user)] = None,
    db: Annotated[Session, Depends(get_db)] = None,
):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    # Save to disk
    safe_filename = f"{project_id}_{version}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size_bytes = os.path.getsize(file_path)
    file_size_str = f"{file_size_bytes / (1024 * 1024):.1f} MB" if file_size_bytes > 1024 * 1024 else f"{file_size_bytes / 1024:.1f} KB"
    file_format = file.filename.split(".")[-1].upper() if "." in file.filename else "PDF"

    doc = Document(
        project_id=project_id,
        student_id=current_user.id,
        file_name=file.filename,
        file_path=file_path,
        file_size=file_size_str,
        file_format=file_format,
        doc_type=doc_type,
        version=version,
        status="Pending",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Notify supervisor
    if project.supervisor_id:
        db.add(
            Notification(
                user_id=project.supervisor_id,
                title="New Deliverable Uploaded",
                message=f"{current_user.full_name} uploaded {doc_type} ({version}). Ready for review.",
            )
        )
        db.commit()

    return doc


@router.get("/download/{document_id}", summary="Download document file")
def download_document(
    document_id: int,
    db: Annotated[Session, Depends(get_db)],
):
    doc = db.get(Document, document_id)
    if not doc or not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="File not found on server.")

    return FileResponse(
        path=doc.file_path,
        filename=doc.file_name,
        media_type="application/octet-stream",
    )


@router.post("/{document_id}/review", response_model=DocumentResponse, summary="Supervisor reviews document")
def review_document(
    document_id: int,
    payload: DocumentReviewRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    doc = db.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    doc.status = payload.status
    doc.supervisor_comment = payload.supervisor_comment
    db.commit()
    db.refresh(doc)

    # Notify student
    db.add(
        Notification(
            user_id=doc.student_id,
            title="Document Review Completed",
            message=f"Supervisor marked {doc.doc_type} ({doc.version}) as '{payload.status}'. Notes: {payload.supervisor_comment or 'None'}",
        )
    )
    db.commit()

    return doc


@router.delete("/{document_id}", summary="Delete uploaded deliverable document")
def delete_document(
    document_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    doc = db.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    # Remove physical file from disk if present
    if doc.file_path and os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception:
            pass

    file_name = doc.file_name
    db.delete(doc)
    db.commit()

    return {"message": f"Document '{file_name}' deleted successfully.", "deleted_id": document_id}

