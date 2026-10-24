from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from database.connection import SessionLocal
from models.user import User
from models.project import Project
from models.feedback import Feedback
from models.document import Document
from models.evaluation import Evaluation
from models.notification import Notification
from models.milestone import Milestone
from services.auth_service import hash_password


def seed_database(reset: bool = False):
    """
    Initializes or resets the database for real-world capstone testing.
    - Preserves/seeds Coordinator and 4 Faculty Supervisors.
    - Preserves/seeds 1 Clean Student account (Hamza Tariq) without any projects.
    - Ensures 6 official department milestones exist.
    - If reset=True, clears all active student proposals, documents, feedback, and evaluations
      so users can test from Step 1 in a clean real-world flow.
    """
    db: Session = SessionLocal()
    try:
        if reset:
            print("Resetting active student projects, evaluations, feedback, and documents...")
            db.execute(delete(Evaluation))
            db.execute(delete(Document))
            db.execute(delete(Feedback))
            db.execute(delete(Notification))
            db.execute(delete(Project))
            db.commit()

        # 1. Seed Coordinator
        coordinator = db.scalar(select(User).where(User.email == "coordinator@university.edu"))
        if not coordinator:
            coordinator = User(
                full_name="Prof. Dr. Tariq Mahmood",
                email="coordinator@university.edu",
                password_hash=hash_password("password123"),
                role="coordinator",
                roll_number="FAC-COORD-01",
            )
            db.add(coordinator)

        # 2. Seed Faculty Supervisors
        supervisors_data = [
            ("Dr. Imran Shah", "supervisor@university.edu", "FAC-CS-101"),
            ("Dr. Noman Ali", "noman.ali@university.edu", "FAC-CS-102"),
            ("Dr. Rabia Qazi", "rabia.qazi@university.edu", "FAC-CS-103"),
            ("Dr. Farhan Jamil", "farhan.jamil@university.edu", "FAC-CS-104"),
        ]
        for name, email, fac_id in supervisors_data:
            s = db.scalar(select(User).where(User.email == email))
            if not s:
                s = User(
                    full_name=name,
                    email=email,
                    password_hash=hash_password("password123"),
                    role="supervisor",
                    roll_number=fac_id,
                )
                db.add(s)

        # 3. Seed Default Clean Student (No project attached)
        default_student = db.scalar(select(User).where(User.email == "student@university.edu"))
        if not default_student:
            default_student = User(
                full_name="Hamza Tariq",
                email="student@university.edu",
                password_hash=hash_password("password123"),
                role="student",
                roll_number="FA20-BSE-058",
            )
            db.add(default_student)
        else:
            default_student.roll_number = "FA20-BSE-058"

        # 4. Seed Department Milestones (Institutional Deadlines)
        ms_count = db.scalar(select(Milestone).limit(1))
        if not ms_count:
            default_milestones = [
                Milestone(
                    milestone="Project Proposal Defense",
                    phase="Phase 1",
                    deadline="20 Sep 2026",
                    submission_weight="10%",
                    status="Active",
                    compliance="Department Gate 1",
                    order_index=1,
                ),
                Milestone(
                    milestone="Software Requirements Specification (SRS)",
                    phase="Phase 2",
                    deadline="10 Oct 2026",
                    submission_weight="15%",
                    status="Upcoming",
                    compliance="Department Gate 2",
                    order_index=2,
                ),
                Milestone(
                    milestone="System Design Document & Architecture",
                    phase="Phase 3",
                    deadline="12 Nov 2026",
                    submission_weight="15%",
                    status="Upcoming",
                    compliance="Department Gate 3",
                    order_index=3,
                ),
                Milestone(
                    milestone="Mid-Term Progress Defense",
                    phase="Phase 4",
                    deadline="20 Dec 2026",
                    submission_weight="20%",
                    status="Upcoming",
                    compliance="Department Gate 4",
                    order_index=4,
                ),
                Milestone(
                    milestone="Prototype Demonstration & Code Freeze",
                    phase="Phase 5",
                    deadline="15 Mar 2027",
                    submission_weight="20%",
                    status="Upcoming",
                    compliance="Department Gate 5",
                    order_index=5,
                ),
                Milestone(
                    milestone="Final Dissertation & External Defense",
                    phase="Phase 6",
                    deadline="25 May 2027",
                    submission_weight="20%",
                    status="Upcoming",
                    compliance="Final Gate",
                    order_index=6,
                ),
            ]
            for m in default_milestones:
                db.add(m)

        db.commit()
        print("Database initialized: Clean real-world slate ready for testing.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database(reset=True)
