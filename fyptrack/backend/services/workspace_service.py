from sqlalchemy import select
from sqlalchemy.orm import Session

from models.user import User
from models.workspace import (
    Invitation,
    Project,
    StudentProfile,
    SupervisorAssignment,
    SupervisorProfile,
)
from schemas.workspace import (
    ProjectRecord,
    StudentRecord,
    SupervisorRecord,
    WorkspaceResponse,
)


def _assignment_names(
    db: Session, student_profile_ids: list[int]
) -> dict[int, tuple[int, str]]:
    if not student_profile_ids:
        return {}
    rows = db.execute(
        select(
            SupervisorAssignment.student_profile_id,
            User.id,
            User.full_name,
        )
        .join(
            SupervisorProfile,
            SupervisorProfile.id == SupervisorAssignment.supervisor_profile_id,
        )
        .join(User, User.id == SupervisorProfile.user_id)
        .where(
            SupervisorAssignment.student_profile_id.in_(student_profile_ids),
            SupervisorAssignment.is_active.is_(True),
        )
    )
    return {profile_id: (user_id, name) for profile_id, user_id, name in rows}


def _projects(
    db: Session,
    student_profiles: list[StudentProfile],
    supervisors: dict[int, tuple[int, str]],
) -> list[ProjectRecord]:
    if not student_profiles:
        return []
    rows = db.execute(
        select(Project, StudentProfile, User)
        .join(StudentProfile, Project.student_profile_id == StudentProfile.id)
        .join(User, User.id == StudentProfile.user_id)
        .where(StudentProfile.id.in_([profile.id for profile in student_profiles]))
        .order_by(Project.id)
    )
    return [
        ProjectRecord(
            id=project.id,
            title=project.title,
            description=project.description,
            status=project.status,
            student_id=student_user.id,
            student_name=student_user.full_name,
            student_email=student_user.email,
            supervisor_id=supervisors.get(profile.id, (None, None))[0],
            supervisor_name=supervisors.get(profile.id, (None, None))[1],
        )
        for project, profile, student_user in rows
    ]


def get_student_workspace(db: Session, user: User) -> WorkspaceResponse:
    profile = db.scalar(select(StudentProfile).where(StudentProfile.user_id == user.id))
    if profile is None:
        return WorkspaceResponse(role="student")
    supervisors = _assignment_names(db, [profile.id])
    projects = _projects(db, [profile], supervisors)
    return WorkspaceResponse(
        role="student",
        projects=projects,
        assigned_supervisor=supervisors.get(profile.id, (None, None))[1],
    )


def get_supervisor_workspace(db: Session, user: User) -> WorkspaceResponse:
    profile = db.scalar(
        select(SupervisorProfile).where(SupervisorProfile.user_id == user.id)
    )
    if profile is None:
        return WorkspaceResponse(role="supervisor")
    rows = db.execute(
        select(StudentProfile, User)
        .join(User, User.id == StudentProfile.user_id)
        .join(
            SupervisorAssignment,
            SupervisorAssignment.student_profile_id == StudentProfile.id,
        )
        .where(
            SupervisorAssignment.supervisor_profile_id == profile.id,
            SupervisorAssignment.is_active.is_(True),
        )
        .order_by(User.full_name)
    ).all()
    students = [student_profile for student_profile, _ in rows]
    supervisors = {student.id: (user.id, user.full_name) for student, user in rows}
    projects = _projects(db, students, supervisors)
    projects_by_student = {}
    for project in projects:
        projects_by_student.setdefault(project.student_id, project)
    return WorkspaceResponse(
        role="supervisor",
        projects=projects,
        students=[
            StudentRecord(
                id=student_user.id,
                full_name=student_user.full_name,
                email=student_user.email,
                project=projects_by_student.get(student_user.id),
            )
            for _, student_user in rows
        ],
    )


def get_coordinator_workspace(db: Session) -> WorkspaceResponse:
    rows = db.execute(
        select(StudentProfile, User)
        .join(User, User.id == StudentProfile.user_id)
        .order_by(User.full_name)
    ).all()
    profiles = [profile for profile, _ in rows]
    supervisors = _assignment_names(db, [profile.id for profile in profiles])
    projects = _projects(db, profiles, supervisors)
    projects_by_student = {}
    for project in projects:
        projects_by_student.setdefault(project.student_id, project)
    supervisor_rows = db.execute(
        select(User.id, User.full_name, User.email)
        .join(SupervisorProfile, SupervisorProfile.user_id == User.id)
        .order_by(User.full_name)
    )
    return WorkspaceResponse(
        role="coordinator",
        projects=projects,
        supervisors=[
            SupervisorRecord(id=user_id, full_name=name, email=email)
            for user_id, name, email in supervisor_rows
        ],
        students=[
            StudentRecord(
                id=student_user.id,
                full_name=student_user.full_name,
                email=student_user.email,
                project=projects_by_student.get(student_user.id),
                supervisor_name=supervisors.get(profile.id, (None, None))[1],
            )
            for profile, student_user in rows
        ],
    )


def create_supervisor_invitation(
    db: Session,
    *,
    full_name: str,
    email: str,
    token_hash: str,
    expires_at,
    invited_by: User,
) -> Invitation:
    if db.scalar(select(User.id).where(User.email == email)) is not None:
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account already exists for this email.",
        )
    db.query(Invitation).filter(
        Invitation.email == email, Invitation.accepted_at.is_(None)
    ).delete(synchronize_session=False)
    invitation = Invitation(
        full_name=full_name,
        email=email,
        token_hash=token_hash,
        expires_at=expires_at,
        invited_by=invited_by,
    )
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return invitation