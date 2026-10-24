from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from dependencies.auth import get_current_user
from models.user import User
from models.project import Project
from services.similarity_service import (
    FACULTY_EXPERTISE_PROFILES,
    recommend_supervisors_for_project,
)

router = APIRouter(prefix="/supervisors", tags=["Supervisors"])


@router.get("/list", summary="Get supervisors with current project quotas")
def get_supervisors_list(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    supervisors = db.scalars(select(User).where(User.role == "supervisor")).all()
    result = []
    for s in supervisors:
        assigned_projects = db.scalars(
            select(Project).where((Project.supervisor_id == s.id) | (Project.supervisor_name == s.full_name))
        ).all()
        capacity = 5
        free_slots = max(0, capacity - len(assigned_projects))
        profile = FACULTY_EXPERTISE_PROFILES.get(s.full_name, {})
        result.append(
            {
                "id": s.id,
                "name": s.full_name,
                "email": s.email,
                "designation": profile.get("designation", "Faculty Supervisor"),
                "primary_domains": profile.get("domains", ["General Computing"]),
                "capacity": capacity,
                "assigned_count": len(assigned_projects),
                "free_slots": free_slots,
                "assigned_groups": [f"{p.group_name} ({p.title[:25]}...)" for p in assigned_projects],
                "status": "Available" if free_slots > 0 else "Full",
            }
        )
    return result


@router.get("/recommendations/{project_id}", summary="Get AI-ranked supervisor recommendations for a project")
def get_supervisor_recommendations(
    project_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    supervisors = db.scalars(select(User).where(User.role == "supervisor")).all()
    faculty_list = []
    for s in supervisors:
        assigned_projects = db.scalars(
            select(Project).where((Project.supervisor_id == s.id) | (Project.supervisor_name == s.full_name))
        ).all()
        capacity = 5
        free_slots = max(0, capacity - len(assigned_projects))
        faculty_list.append({
            "id": s.id,
            "name": s.full_name,
            "email": s.email,
            "capacity": capacity,
            "assigned_count": len(assigned_projects),
            "free_slots": free_slots,
        })

    recommendations = recommend_supervisors_for_project(
        title=project.title,
        domain=project.domain or "",
        abstract=project.abstract or "",
        faculty_list=faculty_list,
    )
    return {
        "project_id": project.id,
        "project_title": project.title,
        "project_domain": project.domain,
        "recommendations": recommendations,
    }

