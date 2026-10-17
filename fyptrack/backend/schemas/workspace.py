from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from schemas.auth import normalize_email


class ProjectRecord(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    student_id: int
    student_name: str
    student_email: str
    supervisor_id: int | None
    supervisor_name: str | None


class StudentRecord(BaseModel):
    id: int
    full_name: str
    email: str
    project: ProjectRecord | None = None
    supervisor_name: str | None = None


class WorkspaceResponse(BaseModel):
    role: Literal["student", "supervisor", "coordinator"]
    projects: list[ProjectRecord] = Field(default_factory=list)
    students: list[StudentRecord] = Field(default_factory=list)
    assigned_supervisor: str | None = None


class AssignmentRequest(BaseModel):
    student_user_id: int = Field(gt=0)
    supervisor_user_id: int = Field(gt=0)


class AssignmentResponse(BaseModel):
    student_user_id: int
    supervisor_user_id: int
    message: str


class SupervisorInvitationRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: str = Field(max_length=320)

    @field_validator("full_name")
    @classmethod
    def strip_full_name(cls, value: str) -> str:
        name = value.strip()
        if len(name) < 2:
            raise ValueError("Full name must contain at least 2 characters.")
        return name

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        return normalize_email(value)


class SupervisorInvitationResponse(BaseModel):
    email: str
    invitation_token: str
    expires_at: datetime
    message: str


class ActivateInvitationRequest(BaseModel):
    invitation_token: str = Field(min_length=32, max_length=128)
    password: str = Field(min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def limit_password_bytes(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes.")
        return value


class ActivatedAccountResponse(BaseModel):
    message: str
    user: dict