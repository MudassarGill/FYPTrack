from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from database.connection import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey("projects.id"), nullable=False)
    supervisor_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    student_name: Mapped[str] = mapped_column(String(120), nullable=False)
    roll_number: Mapped[str] = mapped_column(String(50), nullable=False)
    criteria1: Mapped[int] = mapped_column(Integer, default=0) # Problem Formulation (10)
    criteria2: Mapped[int] = mapped_column(Integer, default=0) # Methodology (10)
    criteria3: Mapped[int] = mapped_column(Integer, default=0) # Progress (5)
    criteria4: Mapped[int] = mapped_column(Integer, default=0) # Viva (5)
    total_marks: Mapped[int] = mapped_column(Integer, default=0)
    remarks: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
