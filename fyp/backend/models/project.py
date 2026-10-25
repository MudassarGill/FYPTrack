from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from database.connection import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    student_name: Mapped[str] = mapped_column(String(120), nullable=False)
    student_email: Mapped[str] = mapped_column(String(320), nullable=False)
    group_name: Mapped[str] = mapped_column(String(50), nullable=False, default="Group 01")
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(100), nullable=False, default="General Computing")
    abstract: Mapped[str] = mapped_column(Text, nullable=False)
    technologies: Mapped[str] = mapped_column(String(255), nullable=True, default="")
    group_members: Mapped[str] = mapped_column(String(255), nullable=True, default="")
    department: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, default="BS Software Engineering")
    
    # Proposal Status (Supervisor Review): "Submitted", "Under Review", "Approved by Supervisor", "Changes Requested", "Rejected"
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="Submitted")
    
    supervisor_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    supervisor_name: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    
    # Coordinator Allocation Status: "Awaiting Supervisor Allocation", "Supervisor Allocated"
    coordinator_status: Mapped[str] = mapped_column(String(50), nullable=False, default="Awaiting Supervisor Allocation")
    coordinator_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    originality_score: Mapped[int] = mapped_column(Integer, nullable=False, default=94)
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
