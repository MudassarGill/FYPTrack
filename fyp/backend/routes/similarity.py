from typing import Annotated, Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from dependencies.auth import get_current_user
from models.user import User
from models.project import Project
from services.similarity_service import (
    ARCHIVED_PROJECTS_POOL,
    scan_proposal_similarity,
    audit_all_projects,
)

router = APIRouter(prefix="/similarity", tags=["Similarity & AI Audits"])


class SimilarityCheckRequest(BaseModel):
    title: str
    domain: Optional[str] = ""
    abstract: str


@router.get("/benchmarks", summary="Get archived departmental theses benchmark pool")
def get_benchmarks(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return ARCHIVED_PROJECTS_POOL


@router.get("/audits", summary="Run comprehensive institutional similarity audit on all active proposals")
def get_similarity_audits(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    projects = db.scalars(select(Project).order_by(Project.id.desc())).all()
    project_dicts = [
        {
            "id": p.id,
            "title": p.title,
            "domain": p.domain,
            "abstract": p.abstract or "",
            "group_name": p.group_name,
            "student_name": p.student_name,
            "supervisor_name": p.supervisor_name or "Not Assigned",
            "status": p.status,
            "originality_score": p.originality_score,
            "created_at": p.created_at.isoformat() if hasattr(p.created_at, "isoformat") else str(p.created_at),
        }
        for p in projects
    ]

    audits = audit_all_projects(project_dicts)
    return {
        "total_proposals_audited": len(audits),
        "archive_benchmarks_count": len(ARCHIVED_PROJECTS_POOL),
        "audits": audits,
    }


@router.post("/check", summary="Real-time NLP similarity check for any proposal text")
def check_similarity(
    payload: SimilarityCheckRequest,
    current_user: Annotated[User, Depends(get_current_user)],
):
    if not payload.title.strip() or not payload.abstract.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title and Abstract are required for similarity evaluation.",
        )

    result = scan_proposal_similarity(
        title=payload.title,
        domain=payload.domain or "",
        abstract=payload.abstract,
    )
    return result
