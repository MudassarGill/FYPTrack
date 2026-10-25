from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class ProjectCreateRequest(BaseModel):
    title: str
    domain: str
    abstract: str
    technologies: Optional[str] = ""
    group_members: Optional[str] = ""
    group_name: Optional[str] = "Group 01"
    department: Optional[str] = "BS Software Engineering"
    coordinator_id: Optional[int] = None


class ProjectUpdateRequest(BaseModel):
    title: Optional[str] = None
    domain: Optional[str] = None
    abstract: Optional[str] = None
    technologies: Optional[str] = None
    group_members: Optional[str] = None
    department: Optional[str] = None
    status: Optional[str] = None


class SupervisorAssignRequest(BaseModel):
    supervisor_id: int
    supervisor_name: str


class SupervisorDecisionRequest(BaseModel):
    status: str # "Approved by Supervisor" or "Changes Requested"
    feedback: Optional[str] = None


class CoordinatorDecisionRequest(BaseModel):
    coordinator_status: str # "Approved by Coordinator", "Rejected", "Changes Requested"
    coordinator_notes: Optional[str] = None


class FeedbackCreateRequest(BaseModel):
    project_id: int
    message: str
    action_type: Optional[str] = "comment"


class DocumentReviewRequest(BaseModel):
    status: str # "Approved" or "Changes Requested"
    supervisor_comment: Optional[str] = None


class EvaluationSubmitRequest(BaseModel):
    project_id: int
    student_name: str
    roll_number: str
    criteria1: int
    criteria2: int
    criteria3: int
    criteria4: int
    remarks: Optional[str] = None


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    student_name: str
    student_email: str
    group_name: str
    title: str
    domain: str
    abstract: str
    technologies: Optional[str] = ""
    group_members: Optional[str] = ""
    department: Optional[str] = "BS Software Engineering"
    status: str
    supervisor_id: Optional[int] = None
    supervisor_name: Optional[str] = None
    coordinator_id: Optional[int] = None
    coordinator_status: str
    coordinator_notes: Optional[str] = None
    originality_score: int
    version: int
    created_at: datetime
    updated_at: datetime


class FeedbackResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    project_id: int
    from_user_id: int
    from_user_name: str
    from_role: str
    to_user_id: Optional[int] = None
    message: str
    action_type: str
    created_at: datetime


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    project_id: int
    student_id: int
    file_name: str
    file_size: str
    file_format: str
    doc_type: str
    version: str
    status: str
    supervisor_comment: Optional[str] = None
    created_at: datetime


class EvaluationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    project_id: int
    supervisor_id: int
    student_name: str
    roll_number: str
    criteria1: int
    criteria2: int
    criteria3: int
    criteria4: int
    total_marks: int
    remarks: Optional[str] = None
    created_at: datetime
