from fastapi.testclient import TestClient

from tests.conftest import login


def test_missing_token_is_unauthorized(client: TestClient) -> None:
    assert client.get("/api/v1/student/workspace").status_code == 401


def test_supervisors_only_receive_assigned_students(client: TestClient) -> None:
    first_headers = login(
        client, "supervisor.one@example.test", "supervisor-one-password"
    )
    second_headers = login(
        client, "supervisor.two@example.test", "supervisor-two-password"
    )
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
    headers = login(client, "student.one@example.test", "student-one-password")

    assert client.get("/api/v1/supervisor/workspace", headers=headers).status_code == 403
    assert client.get("/api/v1/coordinator/workspace", headers=headers).status_code == 403
    assert client.post(
        "/api/v1/coordinator/assignments",
        headers=headers,
        json={"student_user_id": 4, "supervisor_user_id": 2},
    ).status_code == 403


def test_student_workspace_only_contains_own_records(client: TestClient) -> None:
    headers = login(client, "student.one@example.test", "student-one-password")
    response = client.get("/api/v1/student/workspace", headers=headers)

    assert response.status_code == 200
    assert [project["title"] for project in response.json()["projects"]] == [
        "Student One Project"
    ]
    assert response.json()["assigned_supervisor"] == "Supervisor One"


def test_public_signup_cannot_choose_privileged_role(client: TestClient) -> None:
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "full_name": "Public Signup",
            "email": "public@example.test",
            "password": "student-password",
            "role": "coordinator",
        },
    )

    assert response.status_code == 201
    assert response.json()["user"]["role"] == "student"


def test_coordinator_invites_and_activates_supervisor(client: TestClient) -> None:
    headers = login(client, "coordinator@example.test", "coordinator-password")
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
            "password": "invited-password",
        },
    )

    assert activated.status_code == 200
    assert activated.json()["user"]["role"] == "supervisor"
    assert client.post(
        "/api/v1/auth/activate-invitation",
        json={
            "invitation_token": invite.json()["invitation_token"],
            "password": "another-password",
        },
    ).status_code == 400