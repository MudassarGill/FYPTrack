import re
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


UserRole = Literal["student", "supervisor", "coordinator"]


def normalize_email(value: str) -> str:
    email = value.strip().lower()
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        raise ValueError("Enter a valid email address.")
    return email


class SignUpRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: str = Field(max_length=320)
    password: str = Field(min_length=8, max_length=72)

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

    @field_validator("password")
    @classmethod
    def limit_password_bytes(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes.")
        return value


class LoginRequest(BaseModel):
    email: str = Field(max_length=320)
    password: str = Field(min_length=1, max_length=72)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        return normalize_email(value)


class ProfileSettingsRequest(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    email_updates_enabled: bool | None = None

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str | None) -> str | None:
        if value is None:
            return None
        name = value.strip()
        if len(name) < 2:
            raise ValueError("Full name must contain at least 2 characters.")
        return name

    @model_validator(mode="after")
    def require_setting(self) -> "ProfileSettingsRequest":
        if self.full_name is None and self.email_updates_enabled is None:
            raise ValueError("Provide at least one profile setting to update.")
        return self


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: str
    role: UserRole
    email_updates_enabled: bool


class SignUpResponse(BaseModel):
    message: str
    user: UserResponse


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    welcome_message: str
    user: UserResponse
