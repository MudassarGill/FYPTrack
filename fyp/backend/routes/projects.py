import re
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
from models.setting import DepartmentSetting
from schemas.project import (
    ProjectCreateRequest,
    ProjectUpdateRequest,
    SupervisorAssignRequest,
    SupervisorDecisionRequest,
    CoordinatorDecisionRequest,
    ProjectResponse,
)
from services.similarity_service import scan_proposal_similarity

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
            ).order_by(Project.created_at.desc())
        ).all()
        return projects
    else:  # Coordinator sees their projects
        projects = db.scalars(
            select(Project)
            .where(Project.coordinator_id == current_user.id)
            .order_by(Project.created_at.desc())
        ).all()
        return projects


@router.get("/all", response_model=List[ProjectResponse], summary="Get all departmental projects")
def get_all_projects(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if current_user.role == "coordinator":
        projects = db.scalars(
            select(Project)
            .where(Project.coordinator_id == current_user.id)
            .order_by(Project.created_at.desc())
        ).all()
        return projects
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


@router.get("/coordinators", summary="List all departmental coordinators")
def get_coordinators_list(db: Annotated[Session, Depends(get_db)]):
    coords = db.scalars(select(User).where(User.role == "coordinator").order_by(User.id.desc())).all()
    return [{"id": c.id, "name": c.full_name, "email": c.email} for c in coords]


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED, summary="Submit project proposal")
def create_project(
    payload: ProjectCreateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    # Enforce coordinator department rules (max_group_size)
    setting = db.scalar(select(DepartmentSetting).where(DepartmentSetting.id == 1))
    max_group = setting.max_group_size if setting else 3
    if payload.group_members:
        members = [m.strip() for m in payload.group_members.replace(";", ",").replace("\n", ",").split(",") if m.strip()]
        if len(members) > max_group:
            raise HTTPException(
                status_code=400,
                detail=f"Department policy strictly allows a maximum of {max_group} members per group (you specified {len(members)}).",
            )

    # Compute real AI NLP similarity score against archive benchmark pool
    sim_check = scan_proposal_similarity(
        title=payload.title,
        domain=payload.domain or "",
        abstract=payload.abstract or "",
    )
    computed_originality = int(round(float(sim_check.get("originality_score", 92))))

    # Determine Lead Student name (first member specified in group_members, or fallback to current_user)
    lead_author_name = current_user.full_name
    if payload.group_members:
        member_parts = [p.strip() for p in re.split(r"[,;\n]+", payload.group_members) if p.strip()]
        if member_parts:
            clean_first = re.sub(r"\(.*?\)", "", member_parts[0]).strip()
            if clean_first:
                lead_author_name = clean_first

    target_coord_id = payload.coordinator_id
    if not target_coord_id:
        target_coord_id = db.scalar(
            select(User.id).where(User.role == "coordinator").order_by(User.id.desc())
        )

    # Check if student already has a project
    existing = db.scalar(select(Project).where(Project.student_id == current_user.id))
    if existing:
        # Update existing
        existing.student_name = lead_author_name
        existing.title = payload.title
        existing.domain = payload.domain
        existing.abstract = payload.abstract
        existing.technologies = payload.technologies or existing.technologies
        existing.group_members = payload.group_members or existing.group_members
        if payload.department:
            existing.department = payload.department
        if target_coord_id and not existing.coordinator_id:
            existing.coordinator_id = target_coord_id
        elif payload.coordinator_id:
            existing.coordinator_id = payload.coordinator_id
        existing.originality_score = computed_originality
        existing.status = "Submitted"
        existing.version += 1
        db.commit()
        db.refresh(existing)

        # Notify coordinator
        db.add(
            Notification(
                role_target="coordinator",
                title="Proposal Resubmitted",
                message=f"{lead_author_name} resubmitted '{payload.title}' ({existing.group_name}). Originality: {computed_originality}%.",
            )
        )
        if computed_originality < 80:
            db.add(
                Notification(
                    role_target="coordinator",
                    title="High Similarity Alert",
                    message=f"Proposal '{payload.title}' exhibits {sim_check.get('highest_similarity_percent', 0)}% similarity with archived thesis '{sim_check.get('matched_title', '')}'.",
                )
            )
        db.commit()
        return existing

    # Assign group name
    count = db.scalar(select(func.count(Project.id))) or 0
    group_name = f"Group {count + 1:02d}"

    project = Project(
        student_id=current_user.id,
        student_name=lead_author_name,
        student_email=current_user.email,
        group_name=group_name,
        title=payload.title,
        domain=payload.domain,
        abstract=payload.abstract,
        technologies=payload.technologies or "",
        group_members=payload.group_members or current_user.full_name,
        department=payload.department or "BS Software Engineering",
        coordinator_id=target_coord_id,
        status="Submitted",
        originality_score=computed_originality,
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
            message=f"{current_user.full_name} submitted proposal '{payload.title}' ({group_name}). Originality: {computed_originality}%.",
        )
    )
    if computed_originality < 80:
        db.add(
            Notification(
                role_target="coordinator",
                title="High Similarity Alert",
                message=f"Proposal '{payload.title}' exhibits {sim_check.get('highest_similarity_percent', 0)}% similarity with archive thesis '{sim_check.get('matched_title', '')}'.",
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

    changed_content = False
    if payload.title:
        project.title = payload.title
        changed_content = True
    if payload.domain:
        project.domain = payload.domain
        changed_content = True
    if payload.abstract:
        project.abstract = payload.abstract
        changed_content = True
    if payload.technologies:
        project.technologies = payload.technologies
    if payload.group_members:
        project.group_members = payload.group_members
    if payload.department:
        project.department = payload.department
    if payload.status:
        project.status = payload.status
    else:
        # If student is resubmitting after revision
        if project.status == "Changes Requested":
            project.status = "Submitted"
            project.version += 1

    if changed_content:
        sim = scan_proposal_similarity(project.title, project.domain or "", project.abstract or "")
        project.originality_score = sim.get("originality_score", project.originality_score)

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
    project.coordinator_id = current_user.id
    project.coordinator_status = "Supervisor Allocated"
    if project.status in ["Submitted", "Draft"]:
        project.status = "Under Review"
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


@router.post("/{project_id}/coordinator-decision", response_model=ProjectResponse, summary="Coordinator records note")
def coordinator_decision(
    project_id: int,
    payload: CoordinatorDecisionRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if current_user.role != "coordinator":
        raise HTTPException(status_code=403, detail="Only Coordinator can make notes.")

    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    if payload.coordinator_notes:
        project.coordinator_notes = payload.coordinator_notes
    if payload.coordinator_status and "Approved" not in payload.coordinator_status:
        project.coordinator_status = payload.coordinator_status

    db.commit()
    db.refresh(project)

    # Notify student
    if payload.coordinator_notes:
        db.add(
            Notification(
                user_id=project.student_id,
                title="Coordinator Remarks Recorded",
                message=f"Coordinator added notes on {project.group_name}: {payload.coordinator_notes}",
            )
        )
        db.commit()

    return project
