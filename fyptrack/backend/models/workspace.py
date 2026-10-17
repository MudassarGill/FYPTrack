from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.connection import Base


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    department: Mapped[str | None] = mapped_column(String(120))

    user = relationship("User", back_populates="student_profile")
    projects: Mapped[list["Project"]] = relationship(
        "Project", back_populates="student"
    )
    assignments: Mapped[list["SupervisorAssignment"]] = relationship(
        "SupervisorAssignment", back_populates="student"
    )


class SupervisorProfile(Base):
    __tablename__ = "supervisor_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    department: Mapped[str | None] = mapped_column(String(120))

    user = relationship("User", back_populates="supervisor_profile")
    assignments: Mapped[list["SupervisorAssignment"]] = relationship(
        "SupervisorAssignment", back_populates="supervisor"
    )


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_profile_id: Mapped[int] = mapped_column(
        ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(
        String(30), nullable=False, default="proposed", server_default="proposed"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    student = relationship("StudentProfile", back_populates="projects")


class SupervisorAssignment(Base):
    __tablename__ = "supervisor_assignments"
    __table_args__ = (
        Index("ix_supervisor_assignments_active", "supervisor_profile_id", "is_active"),
        Index(
            "uq_supervisor_assignments_active_student",
            "student_profile_id",
            unique=True,
            postgresql_where=text("is_active = true"),
            sqlite_where=text("is_active = 1"),
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_profile_id: Mapped[int] = mapped_column(
        ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False
    )
    supervisor_profile_id: Mapped[int] = mapped_column(
        ForeignKey("supervisor_profiles.id", ondelete="CASCADE"), nullable=False
    )
    assigned_by_user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True, server_default="true"
    )
    assigned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    student = relationship("StudentProfile", back_populates="assignments")
    supervisor = relationship("SupervisorProfile", back_populates="assignments")


class Invitation(Base):
    __tablename__ = "invitations"
    __table_args__ = (
        CheckConstraint("role = 'supervisor'", name="ck_invitations_role"),
        Index("ix_invitations_email", "email"),
        Index("ix_invitations_token_hash", "token_hash", unique=True),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(320), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="supervisor")
    token_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    accepted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    invited_by_user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )

    invited_by = relationship("User", back_populates="sent_invitations")