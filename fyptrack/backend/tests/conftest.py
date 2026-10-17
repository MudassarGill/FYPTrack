from collections.abc import Generator
import secrets

import pytest
from fastapi.testclient import TestClient
from pydantic import SecretStr
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from core.config import settings
from database.connection import Base, get_db
from main import app
from models.user import User
from models.workspace import (
    Project,
    StudentProfile,
    SupervisorAssignment,
    SupervisorProfile,
)
from services.auth_service import hash_password


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch) -> Generator[TestClient, None, None]:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(engine)

    def override_get_db() -> Generator[Session, None, None]:
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    monkeypatch.setattr(settings, "jwt_secret", SecretStr(secrets.token_urlsafe(32)))

    test_passwords = {
        email: secrets.token_urlsafe(20)
        for email in (
            "coordinator@example.test",
            "supervisor.one@example.test",
            "supervisor.two@example.test",
            "student.one@example.test",
            "student.two@example.test",
        )
    }

    with TestingSession() as db:
        coordinator = User(
            full_name="Test Coordinator",
            email="coordinator@example.test",
            role="coordinator",
            password_hash=hash_password(test_passwords["coordinator@example.test"]),
        )
        supervisor_one = User(
            full_name="Supervisor One",
            email="supervisor.one@example.test",
            role="supervisor",
            password_hash=hash_password(test_passwords["supervisor.one@example.test"]),
        )
        supervisor_two = User(
            full_name="Supervisor Two",
            email="supervisor.two@example.test",
            role="supervisor",
            password_hash=hash_password(test_passwords["supervisor.two@example.test"]),
        )
        student_one = User(
            full_name="Student One",
            email="student.one@example.test",
            role="student",
            password_hash=hash_password(test_passwords["student.one@example.test"]),
        )
        student_two = User(
            full_name="Student Two",
            email="student.two@example.test",
            role="student",
            password_hash=hash_password(test_passwords["student.two@example.test"]),
        )
        db.add_all(
            [coordinator, supervisor_one, supervisor_two, student_one, student_two]
        )
        db.flush()
        supervisor_profiles = [
            SupervisorProfile(user=supervisor_one),
            SupervisorProfile(user=supervisor_two),
        ]
        student_profiles = [
            StudentProfile(user=student_one),
            StudentProfile(user=student_two),
        ]
        db.add_all(supervisor_profiles + student_profiles)
        db.flush()
        db.add_all(
            [
                Project(
                    student=student_profiles[0],
                    title="Student One Project",
                    status="in_progress",
                ),
                Project(
                    student=student_profiles[1],
                    title="Student Two Project",
                    status="in_progress",
                ),
                SupervisorAssignment(
                    student=student_profiles[0],
                    supervisor=supervisor_profiles[0],
                    assigned_by_user_id=coordinator.id,
                ),
                SupervisorAssignment(
                    student=student_profiles[1],
                    supervisor=supervisor_profiles[1],
                    assigned_by_user_id=coordinator.id,
                ),
            ]
        )
        db.commit()

    with TestClient(app) as test_client:
        test_client.app.state.test_passwords = test_passwords
        yield test_client
    app.dependency_overrides.clear()
    Base.metadata.drop_all(engine)
    engine.dispose()


def login(client: TestClient, email: str) -> dict[str, str]:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": client.app.state.test_passwords[email]},
    )
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}