from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from database.connection import get_db
from schemas.auth import (
    LoginRequest,
    LoginResponse,
    SignUpRequest,
    SignUpResponse,
    UserResponse,
)
from services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])
bearer_scheme = HTTPBearer(auto_error=False)


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
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(bearer_scheme)
    ],
    db: Annotated[Session, Depends(get_db)],
) -> UserResponse:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = auth_service.get_user_from_token(db, credentials.credentials)
    return UserResponse.model_validate(user)
