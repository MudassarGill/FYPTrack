from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
from fastapi import HTTPException, status
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from core.config import settings
from models.user import User
from schemas.auth import LoginRequest, SignUpRequest


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: int, role: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    secret = settings.jwt_secret.get_secret_value() if settings.jwt_secret else "careerpilot-fyptrack-secret"
    return jwt.encode(
        {"sub": str(user_id), "role": role, "exp": expires_at},
        secret,
        algorithm=settings.jwt_algorithm,
    )


def register_user(db: Session, payload: SignUpRequest) -> tuple[User, str]:
    existing_user = db.scalar(select(User).where(User.email == payload.email))
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists. Please log in.",
        )

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role or "student",
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists.",
        ) from error
    db.refresh(user)

    token = create_access_token(user.id, user.role)
    return user, token


def authenticate_user(db: Session, payload: LoginRequest) -> tuple[User, str]:
    user = db.scalar(select(User).where(User.email == payload.email))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is currently disabled. Please contact administrator.",
        )

    token = create_access_token(user.id, user.role)
    return user, token


def get_user_from_token(db: Session, token: str) -> User:
    secret = settings.jwt_secret.get_secret_value() if settings.jwt_secret else "careerpilot-fyptrack-secret"
    try:
        payload = jwt.decode(
            token,
            secret,
            algorithms=[settings.jwt_algorithm],
        )
        user_id = int(payload["sub"])
    except (JWTError, KeyError, TypeError, ValueError) as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from error

    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def reset_password(db: Session, token: Optional[str], new_password: str) -> bool:
    # If token is provided, verify it or fall back to recent reset
    if token:
        try:
            secret = settings.jwt_secret.get_secret_value() if settings.jwt_secret else "careerpilot-fyptrack-secret"
            payload = jwt.decode(token, secret, algorithms=[settings.jwt_algorithm])
            user_id = int(payload.get("sub", 0))
            user = db.get(User, user_id)
            if user:
                user.password_hash = hash_password(new_password)
                db.commit()
                return True
        except Exception:
            pass

    # If mock token or generic reset
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid or expired password reset link. Please request a new one.",
    )
