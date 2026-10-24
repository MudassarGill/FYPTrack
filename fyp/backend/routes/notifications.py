from typing import Annotated, List
from fastapi import APIRouter, Depends
from sqlalchemy import select, or_, update
from sqlalchemy.orm import Session

from database.connection import get_db
from dependencies.auth import get_current_user
from models.user import User
from models.notification import Notification

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/my", summary="Get current user notifications")
def get_my_notifications(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    notifs = (
        db.scalars(
            select(Notification)
            .where(
                or_(
                    Notification.user_id == current_user.id,
                    Notification.role_target == current_user.role,
                    Notification.role_target == "all",
                )
            )
            .order_by(Notification.created_at.desc())
            .limit(30)
        )
        .all()
    )
    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at.strftime("%d %b %Y, %I:%M %p") if hasattr(n.created_at, "strftime") else str(n.created_at),
            "iso_time": n.created_at.isoformat() if hasattr(n.created_at, "isoformat") else str(n.created_at),
        }
        for n in notifs
    ]


@router.get("/unread-count", summary="Get count of unread notifications")
def get_unread_count(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    notifs = (
        db.scalars(
            select(Notification)
            .where(
                Notification.is_read == False,
                or_(
                    Notification.user_id == current_user.id,
                    Notification.role_target == current_user.role,
                    Notification.role_target == "all",
                ),
            )
        )
        .all()
    )
    return {"unread_count": len(notifs)}


@router.post("/read/{notification_id}", summary="Mark single notification as read")
def mark_as_read(
    notification_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    n = db.get(Notification, notification_id)
    if n and (n.user_id == current_user.id or n.role_target in [current_user.role, "all"]):
        n.is_read = True
        db.commit()
    return {"status": "ok"}


@router.post("/read-all", summary="Mark all current user notifications as read")
def mark_all_as_read(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    notifs = (
        db.scalars(
            select(Notification)
            .where(
                Notification.is_read == False,
                or_(
                    Notification.user_id == current_user.id,
                    Notification.role_target == current_user.role,
                    Notification.role_target == "all",
                ),
            )
        )
        .all()
    )
    for n in notifs:
        n.is_read = True
    db.commit()
    return {"status": "ok", "marked_read": len(notifs)}
