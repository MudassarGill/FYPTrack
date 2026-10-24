from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from database.connection import get_db
from dependencies.auth import get_current_user
from models.user import User
from models.project import Project
from models.feedback import Feedback
from models.notification import Notification
from schemas.project import (
    ProjectCreateRequest,
    ProjectUpdateRequest,
    SupervisorAssignRequest,
    SupervisorDecisionRequest,
    CoordinatorDecisionRequest,
    ProjectResponse,
)
from services.similarity_service import check_originality

router = APIRouter(prefix="/projects", tags=["Projects & Proposals"])


@router.get("/my", response_model=List[ProjectResponse], summary="Get current user projects")
def get_my_projects(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if current_user.role == "student":
        projects = db.scalars(select(Project).where(Project.student_id == current_user.id)).all()
        return projects
    elif current_user.role == "supervisor":
        projects = db.scalars(
            select(Project).where(
                (Project.supervisor_id == current_user.id) | (Project.supervisor_name == current_user.full_name)
            )
        ).all()
        return projects
    else:  # Coordinator sees all
        projects = db.scalars(select(Project).order_by(Project.created_at.desc())).all()
        return projects


@router.get("/all", response_model=List[ProjectResponse], summary="Get all departmental projects")
def get_all_projects(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    projects = db.scalars(select(Project).order_by(Project.created_at.desc())).all()
    return projects


@router.get("/{project_id}", response_model=ProjectResponse, summary="Get project by id")
def get_project(
    project_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    return project


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED, summary="Submit project proposal")
def create_project(
    payload: ProjectCreateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    sim = check_originality(payload.title, payload.abstract)
    calculated_score = sim["originality_score"]

    # Check if student already has a project
    existing = db.scalar(select(Project).where(Project.student_id == current_user.id))
    if existing:
        # Update existing
        existing.title = payload.title
        existing.domain = payload.domain
        existing.abstract = payload.abstract
        existing.technologies = payload.technologies or existing.technologies
        existing.group_members = payload.group_members or existing.group_members
        existing.originality_score = calculated_score
        existing.status = "Submitted"
        existing.version += 1
        db.commit()
        db.refresh(existing)
        return existing

    # Assign group name
    count = db.scalar(select(func.count(Project.id))) or 0
    group_name = f"Group {count + 1:02d}"

    project = Project(
        student_id=current_user.id,
        student_name=current_user.full_name,
        student_email=current_user.email,
        group_name=group_name,
        title=payload.title,
        domain=payload.domain,
        abstract=payload.abstract,
        technologies=payload.technologies or "",
        group_members=payload.group_members or current_user.full_name,
        status="Submitted",
        originality_score=calculated_score,
        version=1,
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # Notify Coordinator
    db.add(
        Notification(
            role_target="coordinator",
            title="New Proposal Submitted",
            message=f"{current_user.full_name} submitted proposal '{payload.title}' ({group_name}).",
        )
    )
    db.commit()
    return project


@router.put("/{project_id}", response_model=ProjectResponse, summary="Update project proposal")
def update_project(
    project_id: int,
    payload: ProjectUpdateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    if payload.title:
        project.title = payload.title
    if payload.domain:
        project.domain = payload.domain
    if payload.abstract:
        project.abstract = payload.abstract
    if payload.technologies:
        project.technologies = payload.technologies
    if payload.group_members:
        project.group_members = payload.group_members
    if payload.status:
        project.status = payload.status
    else:
        # If student is resubmitting after revision
        if project.status == "Changes Requested":
            project.status = "Submitted"
            project.version += 1

    db.commit()
    db.refresh(project)
    return project


@router.post("/{project_id}/assign-supervisor", response_model=ProjectResponse, summary="Assign supervisor to project")
def assign_supervisor(
    project_id: int,
    payload: SupervisorAssignRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if current_user.role != "coordinator":
        raise HTTPException(status_code=403, detail="Only FYP Coordinator can assign supervisors.")

    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    project.supervisor_id = payload.supervisor_id
    project.supervisor_name = payload.supervisor_name
    db.commit()
    db.refresh(project)

    # Notify student
    db.add(
        Notification(
            user_id=project.student_id,
            title="Supervisor Assigned",
            message=f"{payload.supervisor_name} has been assigned as your project supervisor.",
        )
    )
    # Notify supervisor
    db.add(
        Notification(
            user_id=payload.supervisor_id,
            title="New Student Group Assigned",
            message=f"You have been assigned to supervise {project.group_name} ({project.title}).",
        )
    )
    db.commit()

    return project


@router.post("/{project_id}/supervisor-decision", response_model=ProjectResponse, summary="Supervisor decision on proposal")
def supervisor_decision(
    project_id: int,
    payload: SupervisorDecisionRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    project.status = payload.status
    db.commit()
    db.refresh(project)

    # Add feedback message
    if payload.feedback:
        fb = Feedback(
            project_id=project.id,
            from_user_id=current_user.id,
            from_user_name=current_user.full_name,
            from_role="supervisor",
            to_user_id=project.student_id,
            message=payload.feedback,
            action_type="revision_request" if "Changes" in payload.status else "approval",
        )
        db.add(fb)

    # Notify student
    db.add(
        Notification(
            user_id=project.student_id,
            title="Supervisor Feedback Received",
            message=f"Supervisor marked proposal as '{payload.status}'. Notes: {payload.feedback or 'Review recorded.'}",
        )
    )
    db.commit()

    return project


@router.post("/{project_id}/coordinator-decision", response_model=ProjectResponse, summary="Coordinator ratifies decision")
def coordinator_decision(
    project_id: int,
    payload: CoordinatorDecisionRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if current_user.role != "coordinator":
        raise HTTPException(status_code=403, detail="Only Coordinator can make final decisions.")

    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    project.coordinator_status = payload.coordinator_status
    project.coordinator_notes = payload.coordinator_notes
    if payload.coordinator_status == "Approved by Coordinator":
        project.status = "Approved"
    elif payload.coordinator_status == "Rejected":
        project.status = "Rejected"

    db.commit()
    db.refresh(project)

    # Notify student
    db.add(
        Notification(
            user_id=project.student_id,
            title="Coordinator Decision Announced",
            message=f"Project proposal {payload.coordinator_status}. Notes: {payload.coordinator_notes or 'Official decision recorded.'}",
        )
    )
    db.commit()

    return project
