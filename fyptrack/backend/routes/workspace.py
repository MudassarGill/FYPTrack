from datetime import datetime, timedelta, timezone
from hashlib import sha256
import secrets
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database.connection import get_db
from dependencies.auth import require_roles
from models.user import User
from models.workspace import (
    Invitation,
    StudentProfile,
    SupervisorAssignment,
    SupervisorProfile,
)
from schemas.auth import UserResponse
from schemas.workspace import (
    ActivateInvitationRequest,
    ActivatedAccountResponse,
    AssignmentRequest,
    AssignmentResponse,
    SupervisorInvitationRequest,
    SupervisorInvitationResponse,
    WorkspaceResponse,
)
from services import auth_service, workspace_service

router = APIRouter(tags=["Role workspaces"])


@router.get("/student/workspace", response_model=WorkspaceResponse)
def student_workspace(
    user: Annotated[User, Depends(require_roles("student"))],
    db: Annotated[Session, Depends(get_db)],
) -> WorkspaceResponse:
    return workspace_service.get_student_workspace(db, user)


@router.get("/supervisor/workspace", response_model=WorkspaceResponse)
def supervisor_workspace(
    user: Annotated[User, Depends(require_roles("supervisor"))],
    db: Annotated[Session, Depends(get_db)],
) -> WorkspaceResponse:
    return workspace_service.get_supervisor_workspace(db, user)


@router.get("/coordinator/workspace", response_model=WorkspaceResponse)
def coordinator_workspace(
    _user: Annotated[User, Depends(require_roles("coordinator"))],
    db: Annotated[Session, Depends(get_db)],
) -> WorkspaceResponse:
    return workspace_service.get_coordinator_workspace(db)


@router.post(
    "/coordinator/assignments",
    response_model=AssignmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def assign_supervisor(
    payload: AssignmentRequest,
    coordinator: Annotated[User, Depends(require_roles("coordinator"))],
    db: Annotated[Session, Depends(get_db)],
) -> AssignmentResponse:
    student = db.scalar(
        select(StudentProfile)
        .join(User, User.id == StudentProfile.user_id)
        .where(
            StudentProfile.user_id == payload.student_user_id,
            User.role == "student",
            User.is_active.is_(True),
        )
    )
    supervisor = db.scalar(
        select(SupervisorProfile)
        .join(User, User.id == SupervisorProfile.user_id)
        .where(
            SupervisorProfile.user_id == payload.supervisor_user_id,
            User.role == "supervisor",
            User.is_active.is_(True),
        )
    )
    if student is None or supervisor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student or supervisor account was not found.",
        )
    db.query(SupervisorAssignment).filter(
        SupervisorAssignment.student_profile_id == student.id,
        SupervisorAssignment.is_active.is_(True),
    ).update({SupervisorAssignment.is_active: False}, synchronize_session=False)
    db.add(
        SupervisorAssignment(
            student=student,
            supervisor=supervisor,
            assigned_by_user_id=coordinator.id,
        )
    )
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The assignment changed concurrently. Refresh and try again.",
        ) from error
    return AssignmentResponse(
        student_user_id=payload.student_user_id,
        supervisor_user_id=payload.supervisor_user_id,
        message="Supervisor assignment saved.",
    )


@router.post(
    "/coordinator/supervisor-invitations",
    response_model=SupervisorInvitationResponse,
    status_code=status.HTTP_201_CREATED,
)
def invite_supervisor(
    payload: SupervisorInvitationRequest,
    coordinator: Annotated[User, Depends(require_roles("coordinator"))],
    db: Annotated[Session, Depends(get_db)],
) -> SupervisorInvitationResponse:
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    invitation = workspace_service.create_supervisor_invitation(
        db,
        full_name=payload.full_name,
        email=payload.email,
        token_hash=sha256(token.encode("utf-8")).hexdigest(),
        expires_at=expires_at,
        invited_by=coordinator,
    )
    return SupervisorInvitationResponse(
        email=invitation.email,
        invitation_token=token,
        expires_at=invitation.expires_at,
        message="Deliver this single-use token to the supervisor through a trusted channel.",
    )


@router.post(
    "/auth/activate-invitation",
    response_model=ActivatedAccountResponse,
)
def activate_invitation(
    payload: ActivateInvitationRequest,
    db: Annotated[Session, Depends(get_db)],
) -> ActivatedAccountResponse:
    token_hash = sha256(payload.invitation_token.encode("utf-8")).hexdigest()
    now = datetime.now(timezone.utc)
    invitation = db.scalar(
        select(Invitation).where(
            Invitation.token_hash == token_hash,
            Invitation.accepted_at.is_(None),
            Invitation.expires_at > now,
        )
    )
    if invitation is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invitation is invalid, expired, or already used.",
        )
    if db.scalar(select(User.id).where(User.email == invitation.email)) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account already exists for this email.",
        )
    user = User(
        full_name=invitation.full_name,
        email=invitation.email,
        password_hash=auth_service.hash_password(payload.password),
        role="supervisor",
    )
    db.add(user)
    db.flush()
    db.add(SupervisorProfile(user=user))
    invitation.accepted_at = now
    db.commit()
    db.refresh(user)
    return ActivatedAccountResponse(
        message="Supervisor account activated. You can now log in.",
        user=UserResponse.model_validate(user),
    )