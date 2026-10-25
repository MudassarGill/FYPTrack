from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from dependencies.auth import get_current_user
from models.user import User
from models.setting import DepartmentSetting
from models.notification import Notification

router = APIRouter(prefix="/settings", tags=["Department Policy Settings"])


class SettingResponse(BaseModel):
    id: int
    max_group_size: int
    max_supervisor_quota: int
    similarity_threshold_pct: int
    allow_student_self_proposal: bool
    coordinator_name: str
    academic_session: str
    department_name: str
    contact_ext: Optional[str] = ""
    office_location: Optional[str] = ""

    class Config:
        from_attributes = True


class SettingUpdateRequest(BaseModel):
    max_group_size: Optional[int] = None
    max_supervisor_quota: Optional[int] = None
    similarity_threshold_pct: Optional[int] = None
    allow_student_self_proposal: Optional[bool] = None
    coordinator_name: Optional[str] = None
    academic_session: Optional[str] = None
    department_name: Optional[str] = None
    contact_ext: Optional[str] = None
    office_location: Optional[str] = None


def get_or_create_settings(db: Session) -> DepartmentSetting:
    setting = db.scalar(select(DepartmentSetting).where(DepartmentSetting.id == 1))
    coord_user = db.scalar(select(User).where(User.role == "coordinator").order_by(User.id.desc()))
    coord_name = coord_user.full_name if coord_user else "Prof. Dr. Tariq Mahmood"

    if not setting:
        setting = DepartmentSetting(
            id=1,
            max_group_size=3,
            max_supervisor_quota=5,
            similarity_threshold_pct=20,
            allow_student_self_proposal=True,
            coordinator_name=coord_name,
            academic_session="Fall 2025 - Spring 2026",
            department_name="Department of Computer Science & Software Engineering",
            contact_ext="Ext. 4102 / Room 302",
            office_location="CS Block, 3rd Floor",
        )
        db.add(setting)
        db.commit()
        db.refresh(setting)
    elif coord_user and setting.coordinator_name != coord_user.full_name:
        setting.coordinator_name = coord_user.full_name
        db.commit()
        db.refresh(setting)
    return setting


@router.get("/", response_model=SettingResponse, summary="Get departmental rules and policies")
def get_settings(
    db: Annotated[Session, Depends(get_db)],
):
    return get_or_create_settings(db)


@router.put("/", response_model=SettingResponse, summary="Update departmental rules and policies")
def update_settings(
    payload: SettingUpdateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if current_user.role != "coordinator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only FYP Coordinator can modify department policy settings.",
        )

    setting = get_or_create_settings(db)
    old_max_group = setting.max_group_size

    if payload.max_group_size is not None:
        setting.max_group_size = payload.max_group_size
    if payload.max_supervisor_quota is not None:
        setting.max_supervisor_quota = payload.max_supervisor_quota
    if payload.similarity_threshold_pct is not None:
        setting.similarity_threshold_pct = payload.similarity_threshold_pct
    if payload.allow_student_self_proposal is not None:
        setting.allow_student_self_proposal = payload.allow_student_self_proposal
    if payload.coordinator_name is not None:
        setting.coordinator_name = payload.coordinator_name.strip()
        current_user.full_name = payload.coordinator_name.strip()
    if payload.academic_session is not None:
        setting.academic_session = payload.academic_session.strip()
    if payload.department_name is not None:
        setting.department_name = payload.department_name.strip()
    if payload.contact_ext is not None:
        setting.contact_ext = payload.contact_ext.strip()
    if payload.office_location is not None:
        setting.office_location = payload.office_location.strip()

    db.commit()
    db.refresh(setting)

    # Broadcast notification if max group size changed
    if payload.max_group_size is not None and payload.max_group_size != old_max_group:
        users = db.scalars(select(User).where(User.role.in_(["student", "supervisor"]))).all()
        for u in users:
            db.add(
                Notification(
                    user_id=u.id,
                    title="Department Policy Updated",
                    message=f"Coordinator updated Maximum Group Member Limit to {setting.max_group_size} members.",
                )
            )
        db.commit()

    return setting
