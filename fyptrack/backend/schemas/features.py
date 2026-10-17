from typing import Literal
from pydantic import BaseModel, Field, field_validator
from schemas.auth import normalize_email


class ProjectArchiveItem(BaseModel):
    id: str
    title: str
    field: str
    domain: str
    year: str
    student_names: list[str] = Field(default_factory=list)
    supervisor: str
    similarity_score: int
    similarity_status: Literal["safe", "review", "danger"]
    similarity_keywords: list[str] = Field(default_factory=list)
    abstract: str
    methodology: str
    technologies: list[str] = Field(default_factory=list)
    grade: str | None = None
    award: str | None = None


class SimilarityCheckRequest(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    abstract: str = Field(min_length=10, max_length=5000)


class SimilarityMatchDetail(BaseModel):
    project_id: str
    title: str
    score: int
    matched_words: list[str] = Field(default_factory=list)


class SimilarityCheckResponse(BaseModel):
    top_score: int
    status: Literal["safe", "warning", "danger"]
    status_text: str
    extracted_keywords: list[str] = Field(default_factory=list)
    highest_match: SimilarityMatchDetail | None = None
    recommended_supervisors: list[str] = Field(default_factory=list)


class SupervisorSkillItem(BaseModel):
    id: str
    name: str
    title: str
    department: str
    avatar: str
    email: str
    office: str
    domains: list[str] = Field(default_factory=list)
    capacity: int
    assigned_count: int
    skills: list[str] = Field(default_factory=list)
    bio: str
    publications_count: int


class SupervisionPitchRequest(BaseModel):
    supervisor_id: str
    student_name: str = Field(min_length=2, max_length=120)
    student_email: str
    project_title: str = Field(min_length=3, max_length=255)
    pitch: str = Field(min_length=10, max_length=2000)

    @field_validator("student_email")
    @classmethod
    def validate_student_email(cls, value: str) -> str:
        return normalize_email(value)


class SupervisionPitchResponse(BaseModel):
    success: bool
    message: str


class NewsletterSubscribeRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_newsletter_email(cls, value: str) -> str:
        return normalize_email(value)


class NewsletterSubscribeResponse(BaseModel):
    success: bool
    email: str
    message: str
