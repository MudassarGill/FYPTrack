from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from dependencies.auth import get_current_user
from models.user import User
from schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    MessageResponse,
    ResetPasswordRequest,
    SignUpRequest,
    SignUpResponse,
    UserResponse,
)
from services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=SignUpResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an account",
)
def signup(payload: SignUpRequest, db: Annotated[Session, Depends(get_db)]) -> SignUpResponse:
    user, access_token = auth_service.register_user(db, payload)
    return SignUpResponse(
        message="Registration successful! Welcome to FYPTrack.",
        user=UserResponse.model_validate(user),
        access_token=access_token,
    )


@router.post("/login", response_model=LoginResponse, summary="Log in")
def login(payload: LoginRequest, db: Annotated[Session, Depends(get_db)]) -> LoginResponse:
    user, access_token = auth_service.authenticate_user(db, payload)
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        welcome_message=f"Welcome back, {user.full_name}!",
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse, summary="Get the current authenticated user")
def current_user(
    user: Annotated[User, Depends(get_current_user)],
) -> UserResponse:
    return UserResponse.model_validate(user)


@router.post("/forgot-password", response_model=MessageResponse, summary="Request password reset")
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Annotated[Session, Depends(get_db)],
) -> MessageResponse:
    user = db.scalar(select(User).where(User.email == payload.email))
    if user:
        # In dev mode, generate a reset token and print link to console
        token = auth_service.create_access_token(user.id, user.role)
        print(f"\n[DEV MODE] Password reset requested for {user.email}")
        print(f"[DEV MODE] Reset token: {token}")
        print(f"[DEV MODE] Reset link: http://localhost:5173/?view=reset-password&token={token}\n")

    return MessageResponse(
        message="If an account with this email exists, a password reset link has been dispatched."
    )


@router.post("/reset-password", response_model=MessageResponse, summary="Reset password with token")
def reset_password(
    payload: ResetPasswordRequest,
    db: Annotated[Session, Depends(get_db)],
) -> MessageResponse:
    auth_service.reset_password(db, payload.token, payload.new_password)
    return MessageResponse(message="Password has been reset successfully. Please log in.")
