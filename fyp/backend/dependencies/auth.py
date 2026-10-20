from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from database.connection import get_db
from models.user import User
from services.auth_service import get_user_from_token

bearer_scheme = HTTPBearer(auto_error=False)


from sqlalchemy import select

def get_current_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(bearer_scheme)
    ],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    if credentials is None:
        # Fallback to student user in database for preview / unauthenticated testing
        student_user = db.scalar(select(User).where(User.role == "student"))
        if student_user:
            return student_user
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return get_user_from_token(db, credentials.credentials)
