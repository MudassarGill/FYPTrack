import re
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


def normalize_email(value: str) -> str:
    email = value.strip().lower()
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        raise ValueError("Please enter a valid email address.")
    return email


class SignUpRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: str = Field(max_length=320)
    password: str = Field(min_length=8, max_length=72)
    role: Optional[str] = "student"
    roll_number: Optional[str] = None

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


class LoginRequest(BaseModel):
    email: str = Field(max_length=320)
    password: str = Field(min_length=1, max_length=72)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        return normalize_email(value)


class ForgotPasswordRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        return normalize_email(value)


class ResetPasswordRequest(BaseModel):
    token: Optional[str] = None
    new_password: str = Field(min_length=8, max_length=72)
    confirm_password: Optional[str] = None


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: str
    role: str
    roll_number: Optional[str] = None
    email_updates_enabled: bool = True


class SignUpResponse(BaseModel):
    message: str
    user: UserResponse
    access_token: Optional[str] = None
    token_type: str = "bearer"


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    welcome_message: str
    user: UserResponse


class MessageResponse(BaseModel):
    message: str
