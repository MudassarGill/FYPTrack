import secrets

from fastapi.testclient import TestClient
from jose import jwt

from core.config import settings
from tests.conftest import login


def test_missing_token_is_unauthorized(client: TestClient) -> None:
    assert client.get("/api/v1/student/workspace").status_code == 401


def test_supervisors_only_receive_assigned_students(client: TestClient) -> None:
    first_headers = login(client, "supervisor.one@example.test")
    second_headers = login(client, "supervisor.two@example.test")
    first = client.get("/api/v1/supervisor/workspace", headers=first_headers)
    second = client.get("/api/v1/supervisor/workspace", headers=second_headers)

    assert first.status_code == second.status_code == 200
    assert [student["email"] for student in first.json()["students"]] == [
        "student.one@example.test"
    ]
    assert [student["email"] for student in second.json()["students"]] == [
        "student.two@example.test"
    ]


def test_student_cannot_access_privileged_operations(client: TestClient) -> None:
    headers = login(client, "student.one@example.test")

    assert client.get("/api/v1/supervisor/workspace", headers=headers).status_code == 403
    assert client.get("/api/v1/coordinator/workspace", headers=headers).status_code == 403
    assert client.post(
        "/api/v1/coordinator/assignments",
        headers=headers,
        json={"student_user_id": 4, "supervisor_user_id": 2},
    ).status_code == 403


def test_student_workspace_only_contains_own_records(client: TestClient) -> None:
    headers = login(client, "student.one@example.test")
    response = client.get("/api/v1/student/workspace", headers=headers)

    assert response.status_code == 200
    assert [project["title"] for project in response.json()["projects"]] == [
        "Student One Project"
    ]
    assert response.json()["assigned_supervisor"] == "Supervisor One"


def test_user_can_save_profile_name_and_notification_preference(client: TestClient) -> None:
    headers = login(client, "student.one@example.test")
    response = client.patch(
        "/api/v1/auth/me",
        headers=headers,
        json={"full_name": "Student One Updated", "email_updates_enabled": False},
    )

    assert response.status_code == 200
    assert response.json()["full_name"] == "Student One Updated"
    assert response.json()["email_updates_enabled"] is False


def test_coordinator_sees_university_records_and_database_role_wins(client: TestClient) -> None:
    token = jwt.encode(
        {"sub": "1", "role": "student"},
        settings.jwt_secret.get_secret_value(),
        algorithm=settings.jwt_algorithm,
    )
    response = client.get(
        "/api/v1/coordinator/workspace",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert len(response.json()["students"]) == 2
    assert len(response.json()["projects"]) == 2


def test_coordinator_can_change_an_assignment(client: TestClient) -> None:
    headers = login(client, "coordinator@example.test")
    response = client.post(
        "/api/v1/coordinator/assignments",
        headers=headers,
        json={"student_user_id": 4, "supervisor_user_id": 3},
    )
    supervisor_headers = login(client, "supervisor.two@example.test")
    workspace = client.get("/api/v1/supervisor/workspace", headers=supervisor_headers)

    assert response.status_code == 201
    assert [student["email"] for student in workspace.json()["students"]] == [
        "student.one@example.test",
        "student.two@example.test",
    ]


def test_public_signup_cannot_choose_privileged_role(client: TestClient) -> None:
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "full_name": "Public Signup",
            "email": "public@example.test",
            "password": secrets.token_urlsafe(16),
            "role": "coordinator",
        },
    )

    assert response.status_code == 201
    assert response.json()["user"]["role"] == "student"


def test_coordinator_invites_and_activates_supervisor(client: TestClient) -> None:
    headers = login(client, "coordinator@example.test")
    activation_password = secrets.token_urlsafe(16)
    invite = client.post(
        "/api/v1/coordinator/supervisor-invitations",
        headers=headers,
        json={"full_name": "Invited Supervisor", "email": "invited@example.test"},
    )
    assert invite.status_code == 201
    activated = client.post(
        "/api/v1/auth/activate-invitation",
        json={
            "invitation_token": invite.json()["invitation_token"],
            "password": activation_password,
        },
    )

    assert activated.status_code == 200
    assert activated.json()["user"]["role"] == "supervisor"
    assert client.post(
        "/api/v1/auth/activate-invitation",
        json={
            "invitation_token": invite.json()["invitation_token"],
            "password": secrets.token_urlsafe(16),
        },
    ).status_code == 400