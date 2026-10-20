from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from dependencies.auth import get_current_user
from models.user import User
from models.project import Project
from models.evaluation import Evaluation
from models.notification import Notification
from schemas.project import EvaluationSubmitRequest, EvaluationResponse

router = APIRouter(prefix="/evaluations", tags=["Evaluations"])


@router.get("/project/{project_id}", response_model=List[EvaluationResponse], summary="Get project evaluations")
def get_evaluations(
    project_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    evals = db.scalars(select(Evaluation).where(Evaluation.project_id == project_id)).all()
    return evals


@router.post("/", response_model=EvaluationResponse, status_code=status.HTTP_201_CREATED, summary="Submit evaluation marks")
def submit_evaluation(
    payload: EvaluationSubmitRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    project = db.get(Project, payload.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    total = payload.criteria1 + payload.criteria2 + payload.criteria3 + payload.criteria4

    # Check if existing evaluation for this student
    existing = db.scalar(
        select(Evaluation).where(
            Evaluation.project_id == payload.project_id,
            Evaluation.student_name == payload.student_name,
        )
    )
    if existing:
        existing.criteria1 = payload.criteria1
        existing.criteria2 = payload.criteria2
        existing.criteria3 = payload.criteria3
        existing.criteria4 = payload.criteria4
        existing.total_marks = total
        existing.remarks = payload.remarks or existing.remarks
        db.commit()
        db.refresh(existing)
        return existing

    evaluation = Evaluation(
        project_id=payload.project_id,
        supervisor_id=current_user.id,
        student_name=payload.student_name,
        roll_number=payload.roll_number,
        criteria1=payload.criteria1,
        criteria2=payload.criteria2,
        criteria3=payload.criteria3,
        criteria4=payload.criteria4,
        total_marks=total,
        remarks=payload.remarks or "",
    )
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)

    # Notify student
    db.add(
        Notification(
            user_id=project.student_id,
            title="Evaluation Marks Recorded",
            message=f"Supervisor has graded milestone for {payload.student_name}: {total}/30. Remarks: {payload.remarks or 'Approved.'}",
        )
    )
    db.commit()

    return evaluation
