from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column
from database.connection import Base


class Milestone(Base):
    __tablename__ = "milestones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    milestone: Mapped[str] = mapped_column(String(150), nullable=False)
    phase: Mapped[str] = mapped_column(String(50), nullable=False)
    deadline: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g., "12 Nov 2026"
    submission_weight: Mapped[str] = mapped_column(String(20), nullable=False, default="15%")
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="Upcoming")  # "Completed", "Active", "Upcoming"
    compliance: Mapped[str] = mapped_column(String(100), nullable=True, default="")
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
