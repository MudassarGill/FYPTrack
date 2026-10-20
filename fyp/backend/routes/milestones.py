from datetime import datetime
from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from dependencies.auth import get_current_user
from models.user import User
from models.milestone import Milestone
from models.notification import Notification

router = APIRouter(prefix="/milestones", tags=["Milestones"])


class MilestoneResponse(BaseModel):
    id: int
    milestone: str
    phase: str
    deadline: str
    submission_weight: str
    status: str
    compliance: Optional[str] = ""
    order_index: int

    class Config:
        from_attributes = True


class MilestoneUpdateRequest(BaseModel):
    deadline: Optional[str] = None
    status: Optional[str] = None
    submission_weight: Optional[str] = None


@router.get("/", response_model=List[MilestoneResponse], summary="List all departmental milestones")
def list_milestones(
    db: Annotated[Session, Depends(get_db)],
):
    milestones = db.scalars(select(Milestone).order_by(Milestone.order_index)).all()
    return milestones


@router.put("/{milestone_id}", response_model=MilestoneResponse, summary="Update milestone deadline & status")
def update_milestone(
    milestone_id: int,
    payload: MilestoneUpdateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    ms = db.get(Milestone, milestone_id)
    if not ms:
        raise HTTPException(status_code=404, detail="Milestone not found.")

    old_deadline = ms.deadline
    if payload.deadline is not None:
        ms.deadline = payload.deadline.strip()
    if payload.status is not None:
        ms.status = payload.status.strip()
    if payload.submission_weight is not None:
        ms.submission_weight = payload.submission_weight.strip()

    db.commit()
    db.refresh(ms)

    # If deadline changed, broadcast notification to all students and supervisors
    if payload.deadline and payload.deadline != old_deadline:
        users = db.scalars(select(User).where(User.role.in_(["student", "supervisor"]))).all()
        for u in users:
            db.add(
                Notification(
                    user_id=u.id,
                    title=f"Deadline Updated: {ms.milestone}",
                    message=f"Department academic deadline for {ms.milestone} ({ms.phase}) has been updated to {ms.deadline} by Coordinator.",
                )
            )
        db.commit()

    return ms


@router.post("/broadcast", summary="Broadcast milestone reminder to all students and supervisors")
def broadcast_milestone_reminder(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    active_ms = db.scalar(select(Milestone).where(Milestone.status == "Active").order_by(Milestone.order_index))
    if not active_ms:
        active_ms = db.scalar(select(Milestone).where(Milestone.status == "Upcoming").order_by(Milestone.order_index))

    title = f"Milestone Reminder: {active_ms.milestone}" if active_ms else "FYP Milestone Reminder"
    msg = f"Reminder: {active_ms.milestone} deliverable is due on {active_ms.deadline}. Ensure all files are uploaded on FYPTrack on time." if active_ms else "Please review upcoming academic deadlines on FYPTrack."

    users = db.scalars(select(User).where(User.role.in_(["student", "supervisor"]))).all()
    for u in users:
        db.add(
            Notification(
                user_id=u.id,
                title=title,
                message=msg,
            )
        )
    db.commit()

    return {"message": f"Broadcast successfully sent to {len(users)} academic stakeholders."}
