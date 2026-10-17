from getpass import getpass

from sqlalchemy import select

from database.connection import SessionLocal
from models.user import User
from models.workspace import (
    Project,
    StudentProfile,
    SupervisorAssignment,
    SupervisorProfile,
)
from services.auth_service import hash_password


DEMO_ACCOUNTS = (
    ("coordinator", "FYPTrack Demo Coordinator", "coordinator.demo@example.test"),
    ("supervisor", "FYPTrack Demo Supervisor One", "supervisor.one@example.test"),
    ("supervisor", "FYPTrack Demo Supervisor Two", "supervisor.two@example.test"),
    ("student", "FYPTrack Demo Student One", "student.one@example.test"),
    ("student", "FYPTrack Demo Student Two", "student.two@example.test"),
)


def prompt_password(email: str) -> str:
    while True:
        password = getpass(f"Password for {email} (not echoed): ")
        confirmation = getpass("Confirm password: ")
        if password != confirmation:
            print("Passwords do not match. Try again.")
            continue
        if not 8 <= len(password.encode("utf-8")) <= 72:
            print("Use a password between 8 and 72 UTF-8 bytes.")
            continue
        return password


def main() -> None:
    if SessionLocal is None:
        raise RuntimeError("Set FYPTRACK_DATABASE_URL before provisioning demo data.")
    passwords = {email: prompt_password(email) for _, _, email in DEMO_ACCOUNTS}
    with SessionLocal() as db:
        accounts = {}
        for role, name, email in DEMO_ACCOUNTS:
            user = db.scalar(select(User).where(User.email == email))
            if user is None:
                user = User(
                    full_name=name,
                    email=email,
                    role=role,
                    password_hash=hash_password(passwords[email]),
                )
                db.add(user)
                db.flush()
            elif user.role != role:
                raise RuntimeError(f"Existing demo email {email} has the wrong role.")
            else:
                user.full_name = name
                user.password_hash = hash_password(passwords[email])
                user.is_active = True
            accounts[email] = user

        supervisors = []
        for _, _, email in DEMO_ACCOUNTS[1:3]:
            user = accounts[email]
            profile = db.scalar(
                select(SupervisorProfile).where(SupervisorProfile.user_id == user.id)
            )
            if profile is None:
                profile = SupervisorProfile(user=user)
                db.add(profile)
                db.flush()
            supervisors.append(profile)

        student_profiles = []
        for index, (_, _, email) in enumerate(DEMO_ACCOUNTS[3:], start=1):
            user = accounts[email]
            profile = db.scalar(
                select(StudentProfile).where(StudentProfile.user_id == user.id)
            )
            if profile is None:
                profile = StudentProfile(user=user)
                db.add(profile)
                db.flush()
            if db.scalar(
                select(Project.id).where(Project.student_profile_id == profile.id)
            ) is None:
                db.add(
                    Project(
                        student=profile,
                        title=f"Demo Project {index}",
                        description="Local role-isolation scenario project.",
                        status="in_progress",
                    )
                )
            db.query(SupervisorAssignment).filter(
                SupervisorAssignment.student_profile_id == profile.id,
                SupervisorAssignment.is_active.is_(True),
            ).update({SupervisorAssignment.is_active: False}, synchronize_session=False)
            db.add(
                SupervisorAssignment(
                    student=profile,
                    supervisor=supervisors[index - 1],
                    assigned_by_user_id=accounts[
                        "coordinator.demo@example.test"
                    ].id,
                )
            )
            student_profiles.append(profile)
        db.commit()

    print("Demo scenario provisioned. Passwords were entered interactively and not displayed.")
    for role, _, email in DEMO_ACCOUNTS:
        print(f"{role}: {email}")


if __name__ == "__main__":
    main()