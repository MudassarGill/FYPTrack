from sqlalchemy import select
from sqlalchemy.orm import Session
from database.connection import SessionLocal
from models.user import User
from models.project import Project
from models.feedback import Feedback
from models.document import Document
from models.notification import Notification
from services.auth_service import hash_password


def seed_database():
    db: Session = SessionLocal()
    try:
        # 1. Seed Coordinator
        coordinator = db.scalar(select(User).where(User.email == "coordinator@university.edu"))
        if not coordinator:
            coordinator = User(
                full_name="Prof. Dr. Tariq Mahmood",
                email="coordinator@university.edu",
                password_hash=hash_password("password123"),
                role="coordinator",
            )
            db.add(coordinator)

        # 2. Seed Faculty Supervisors
        supervisors_data = [
            ("Dr. Imran Shah", "supervisor@university.edu"),
            ("Dr. Noman Ali", "noman.ali@university.edu"),
            ("Dr. Rabia Qazi", "rabia.qazi@university.edu"),
            ("Dr. Farhan Jamil", "farhan.jamil@university.edu"),
        ]
        supervisor_objects = []
        for name, email in supervisors_data:
            s = db.scalar(select(User).where(User.email == email))
            if not s:
                s = User(
                    full_name=name,
                    email=email,
                    password_hash=hash_password("password123"),
                    role="supervisor",
                )
                db.add(s)
            supervisor_objects.append(s)

        # 3. Seed Default Student
        default_student = db.scalar(select(User).where(User.email == "student@university.edu"))
        if not default_student:
            default_student = User(
                full_name="Hamza Tariq",
                email="student@university.edu",
                password_hash=hash_password("password123"),
                role="student",
            )
            db.add(default_student)

        db.commit()

        # 4. Seed initial projects if table empty
        project_count = db.scalar(select(Project).limit(1))
        if not project_count:
            p1 = Project(
                student_id=default_student.id,
                student_name=default_student.full_name,
                student_email=default_student.email,
                group_name="Group 14",
                title="Crop Price Prediction and Market Advisory System",
                domain="Machine Learning",
                abstract="A deep learning and time-series model analyzing historical mandi arrival volumes and weather metrics to predict future wholesale market price fluctuations for seasonal crops.",
                technologies="Python, FastAPI, PyTorch, React",
                group_members="Hamza Tariq (Lead), Ayesha Noor, Zainab Ali",
                status="Submitted",
                supervisor_id=supervisor_objects[0].id if supervisor_objects else None,
                supervisor_name="Dr. Imran Shah",
                coordinator_status="Pending Decision",
                originality_score=94,
                version=1,
            )
            db.add(p1)
            db.commit()

            # Seed a sample feedback thread
            f1 = Feedback(
                project_id=p1.id,
                from_user_id=supervisor_objects[0].id,
                from_user_name="Dr. Imran Shah",
                from_role="supervisor",
                to_user_id=default_student.id,
                message="Initial methodology outline looks promising. Please expand Section 3 on dataset preprocessing and mandi arrival frequency.",
                action_type="revision_request",
            )
            db.add(f1)

            # Seed sample notification
            n1 = Notification(
                user_id=default_student.id,
                title="Supervisor Assigned",
                message="Dr. Imran Shah has been assigned as your FYP supervisor by the Coordinator.",
            )
            db.add(n1)

            db.commit()
            print("Database seeded with initial demonstration accounts & projects.")

        # 5. Seed department milestones if table empty
        from models.milestone import Milestone
        ms_count = db.scalar(select(Milestone).limit(1))
        if not ms_count:
            default_milestones = [
                Milestone(
                    milestone="Project Proposal Defense",
                    phase="Phase 1",
                    deadline="20 Sep 2026",
                    submission_weight="10%",
                    status="Completed",
                    compliance="48 / 48 Groups (100%)",
                    order_index=1,
                ),
                Milestone(
                    milestone="Software Requirements Specification (SRS)",
                    phase="Phase 2",
                    deadline="10 Oct 2026",
                    submission_weight="15%",
                    status="Completed",
                    compliance="48 / 48 Groups (100%)",
                    order_index=2,
                ),
                Milestone(
                    milestone="System Design Document & Architecture",
                    phase="Phase 3",
                    deadline="12 Nov 2026",
                    submission_weight="15%",
                    status="Active",
                    compliance="26 / 48 Groups Submitted",
                    order_index=3,
                ),
                Milestone(
                    milestone="Mid-Term Progress Defense",
                    phase="Phase 4",
                    deadline="20 Dec 2026",
                    submission_weight="20%",
                    status="Upcoming",
                    compliance="Rubric Published",
                    order_index=4,
                ),
                Milestone(
                    milestone="Prototype Demonstration & Code Freeze",
                    phase="Phase 5",
                    deadline="15 Mar 2027",
                    submission_weight="20%",
                    status="Upcoming",
                    compliance="Pending Phase",
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
            print("Database seeded with department milestones.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()
