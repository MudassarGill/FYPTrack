from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from dependencies.auth import get_current_user
from models.user import User
from models.project import Project
from models.feedback import Feedback
from models.notification import Notification
from schemas.project import FeedbackCreateRequest, FeedbackResponse

router = APIRouter(prefix="/feedback", tags=["Feedback"])


@router.get("/project/{project_id}", response_model=List[FeedbackResponse], summary="Get feedback thread for project")
def get_project_feedback(
    project_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    threads = (
        db.scalars(select(Feedback).where(Feedback.project_id == project_id).order_by(Feedback.created_at.asc()))
        .all()
    )
    return threads


@router.post("/", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED, summary="Add feedback comment or reply")
def post_feedback(
    payload: FeedbackCreateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    project = db.get(Project, payload.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    target_user_id = project.student_id if current_user.role != "student" else project.supervisor_id

    fb = Feedback(
        project_id=payload.project_id,
        from_user_id=current_user.id,
        from_user_name=current_user.full_name,
        from_role=current_user.role,
        to_user_id=target_user_id,
        message=payload.message,
        action_type=payload.action_type or "comment",
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)

    # Notify recipient
    if target_user_id:
        db.add(
            Notification(
                user_id=target_user_id,
                title="New Message Received",
                message=f"{current_user.full_name} ({current_user.role}): {payload.message[:80]}...",
            )
        )
        db.commit()

    return fb
