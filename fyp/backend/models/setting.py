from datetime import datetime
from sqlalchemy import DateTime, Integer, String, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column
from database.connection import Base


class DepartmentSetting(Base):
    __tablename__ = "department_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    max_group_size: Mapped[int] = mapped_column(Integer, nullable=False, default=3)
    max_supervisor_quota: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    similarity_threshold_pct: Mapped[int] = mapped_column(Integer, nullable=False, default=20)
    allow_student_self_proposal: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    coordinator_name: Mapped[str] = mapped_column(String(150), nullable=False, default="Prof. Dr. Tariq Mahmood")
    academic_session: Mapped[str] = mapped_column(String(100), nullable=False, default="Fall 2025 - Spring 2026")
    department_name: Mapped[str] = mapped_column(
        String(255), nullable=False, default="Department of Computer Science & Software Engineering"
    )
    contact_ext: Mapped[str] = mapped_column(String(100), nullable=True, default="Ext. 4102 / Room 302")
    office_location: Mapped[str] = mapped_column(String(150), nullable=True, default="CS Block, 3rd Floor")

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
