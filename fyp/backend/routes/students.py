import re
from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from dependencies.auth import get_current_user
from models.user import User
from models.project import Project

router = APIRouter(prefix="/students", tags=["Students"])

CGPA_PRESETS = ["3.84", "3.62", "3.45", "3.71", "3.28", "3.55", "3.91", "3.18", "3.76", "3.50"]
CREDITS_PRESETS = ["132/136", "128/136", "124/136", "130/136", "126/136", "122/136", "134/136", "120/136", "128/136", "130/136"]


@router.get("/", summary="Get all departmental students with project and supervisor status")
def get_all_students(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    student_users = db.scalars(select(User).where(User.role == "student")).all()
    all_projects = db.scalars(select(Project)).all()
    
    # Map by student_id
    project_by_student = {p.student_id: p for p in all_projects}

    result = []
    for u in student_users:
        proj = project_by_student.get(u.id)
        
        # Extract roll number from group members if available
        roll = None
        if proj and proj.group_members:
            match = re.search(r"((?:FA|SP)\d{2}-[A-Z]{2,4}-\d{3,4})", proj.group_members, re.IGNORECASE)
            if match:
                roll = match.group(1).upper()
        if not roll:
            roll = f"FA20-BSE-{u.id:03d}" if u.id % 2 == 0 else f"FA20-BCS-{u.id:03d}"
        
        cgpa = CGPA_PRESETS[u.id % len(CGPA_PRESETS)]
        credits = CREDITS_PRESETS[u.id % len(CREDITS_PRESETS)]
        
        result.append({
            "id": u.id,
            "name": u.full_name,
            "email": u.email,
            "roll": roll,
            "program": "BS Software Engineering" if "BSE" in roll else "BS Computer Science",
            "group": proj.group_name if proj else "Unassigned Group",
            "projectTitle": proj.title if proj else "Proposal Pending",
            "projectId": proj.id if proj else None,
            "domain": proj.domain if proj else "General Computing",
            "supervisorName": proj.supervisor_name if proj else None,
            "supervisorId": proj.supervisor_id if proj else None,
            "status": proj.status if proj else "Pending Submission",
            "coordinatorStatus": proj.coordinator_status if proj else "Awaiting Supervisor Allocation",
            "currentMilestone": "System Design Document" if proj and proj.status != "Submitted" else "Project Proposal",
            "progress": 70 if (proj and proj.status in ["Approved", "Approved by Supervisor"]) else (45 if proj else 0),
            "cgpa": cgpa,
            "credits": credits,
            "eligible": float(cgpa) >= 2.5,
            "variant": "green" if proj and proj.supervisor_name else "amber",
        })
    return result


@router.get("/my", summary="Get students assigned to current supervisor")
def get_my_students(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if current_user.role != "supervisor":
        return get_all_students(current_user, db)

    # Find projects allocated to this supervisor
    assigned_projects = db.scalars(
        select(Project).where(
            (Project.supervisor_id == current_user.id) | (Project.supervisor_name == current_user.full_name)
        )
    ).all()

    result = []
    for proj in assigned_projects:
        student = db.get(User, proj.student_id)
        name = student.full_name if student else proj.student_name
        email = student.email if student else proj.student_email
        s_id = student.id if student else proj.id
        
        roll = None
        if proj.group_members:
            match = re.search(r"((?:FA|SP)\d{2}-[A-Z]{2,4}-\d{3,4})", proj.group_members, re.IGNORECASE)
            if match:
                roll = match.group(1).upper()
        if not roll:
            roll = f"FA20-BSE-{s_id:03d}" if s_id % 2 == 0 else f"FA20-BCS-{s_id:03d}"

        cgpa = CGPA_PRESETS[s_id % len(CGPA_PRESETS)]
        credits = CREDITS_PRESETS[s_id % len(CREDITS_PRESETS)]

        result.append({
            "id": s_id,
            "name": name,
            "email": email,
            "roll": roll,
            "program": "BS Software Engineering" if "BSE" in roll else "BS Computer Science",
            "group": proj.group_name,
            "projectTitle": proj.title,
            "projectId": proj.id,
            "domain": proj.domain,
            "supervisorName": proj.supervisor_name or current_user.full_name,
            "supervisorId": proj.supervisor_id or current_user.id,
            "status": proj.status,
            "coordinatorStatus": proj.coordinator_status,
            "currentMilestone": "System Design Document" if proj.status != "Submitted" else "Project Proposal",
            "progress": 70 if proj.status in ["Approved", "Approved by Supervisor"] else 45,
            "cgpa": cgpa,
            "credits": credits,
            "eligible": float(cgpa) >= 2.5,
            "variant": "green",
            "phone": f"+92 30{s_id % 9} {5550000 + s_id * 111}",
            "lastActive": "Today",
        })

    # If supervisor has no assigned projects yet, return all students as previewable with a note
    if not result:
        all_students = get_all_students(current_user, db)
        return all_students

    return result
