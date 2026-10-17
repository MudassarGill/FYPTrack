from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.connection import get_db
from dependencies.auth import get_current_user
from models.user import User
from schemas.auth import (
    LoginRequest,
    LoginResponse,
    ProfileSettingsRequest,
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
    summary="Create a student account",
)
def signup(payload: SignUpRequest, db: Annotated[Session, Depends(get_db)]) -> SignUpResponse:
    user = auth_service.register_user(db, payload)
    return SignUpResponse(message="Account created. Please log in.", user=user)


@router.post("/login", response_model=LoginResponse, summary="Log in")
def login(payload: LoginRequest, db: Annotated[Session, Depends(get_db)]) -> LoginResponse:
    user, access_token = auth_service.authenticate_user(db, payload)
    return LoginResponse(
        access_token=access_token,
        welcome_message=auth_service.ROLE_WELCOME_MESSAGES[user.role],
        user=user,
    )


@router.get("/me", response_model=UserResponse, summary="Get the current user")
def current_user(
    user: Annotated[User, Depends(get_current_user)],
) -> UserResponse:
    return UserResponse.model_validate(user)


@router.patch("/me", response_model=UserResponse, summary="Update profile settings")
def update_current_user(
    payload: ProfileSettingsRequest,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> UserResponse:
    if payload.full_name is not None:
        user.full_name = payload.full_name
    if payload.email_updates_enabled is not None:
        user.email_updates_enabled = payload.email_updates_enabled
    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)
