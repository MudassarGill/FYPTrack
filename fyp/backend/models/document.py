from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from database.connection import Base


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(Integer, ForeignKey("projects.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    file_size: Mapped[str] = mapped_column(String(50), nullable=False, default="1.2 MB")
    file_format: Mapped[str] = mapped_column(String(50), nullable=False, default="PDF")
    doc_type: Mapped[str] = mapped_column(String(100), nullable=False, default="Deliverable")
    version: Mapped[str] = mapped_column(String(20), nullable=False, default="v1.0")
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="Pending") # Pending, Approved, Changes Requested
    supervisor_comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
