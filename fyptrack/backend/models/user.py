from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, CheckConstraint, DateTime, Index, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.connection import Base

if TYPE_CHECKING:
    from models.workspace import Invitation, StudentProfile, SupervisorProfile


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(
            "role IN ('student', 'supervisor', 'coordinator')",
            name="ck_users_role",
        ),
        Index("ix_users_email", "email", unique=True),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(320), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    role: Mapped[str] = mapped_column(
        String(20), nullable=False, default="student", server_default="student"
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True, server_default="true"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    student_profile: Mapped["StudentProfile | None"] = relationship(
        "StudentProfile", back_populates="user", uselist=False
    )
    supervisor_profile: Mapped["SupervisorProfile | None"] = relationship(
        "SupervisorProfile", back_populates="user", uselist=False
    )
    sent_invitations: Mapped[list["Invitation"]] = relationship(
        "Invitation", back_populates="invited_by"
    )
