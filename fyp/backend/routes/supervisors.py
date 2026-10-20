from typing import Annotated, List
from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from database.connection import get_db
from dependencies.auth import get_current_user
from models.user import User
from models.project import Project

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
        result.append(
            {
                "id": s.id,
                "name": s.full_name,
                "email": s.email,
                "capacity": capacity,
                "assigned_count": len(assigned_projects),
                "free_slots": free_slots,
                "assigned_groups": [f"{p.group_name} ({p.title[:25]}...)" for p in assigned_projects],
                "status": "Available" if free_slots > 0 else "Full",
            }
        )
    return result
