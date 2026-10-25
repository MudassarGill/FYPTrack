from sqlalchemy import select
from sqlalchemy.orm import Session
from database.connection import SessionLocal
from models.user import User
from models.milestone import Milestone
from models.setting import DepartmentSetting
from services.auth_service import hash_password


def seed_database():
    db: Session = SessionLocal()
    try:
        # Check if users already exist (e.g. freshly created user accounts)
        user_count = db.scalar(select(User.id))
        if not user_count:
            # 1. Seed Coordinator only on empty initial DB
            coordinator = User(
                full_name="Prof. Dr. Tariq Mahmood",
                email="coordinator@university.edu",
                password_hash=hash_password("password123"),
                role="coordinator",
            )
            db.add(coordinator)

            # 2. Seed Faculty Supervisors only on empty initial DB
            supervisors_data = [
                ("Dr. Imran Shah", "supervisor@university.edu"),
                ("Dr. Noman Ali", "noman.ali@university.edu"),
                ("Dr. Rabia Qazi", "rabia.qazi@university.edu"),
                ("Dr. Farhan Jamil", "farhan.jamil@university.edu"),
            ]
            for name, email in supervisors_data:
                s = User(
                    full_name=name,
                    email=email,
                    password_hash=hash_password("password123"),
                    role="supervisor",
                )
                db.add(s)
            db.commit()

        # 3. Seed Department Settings
        setting = db.scalar(select(DepartmentSetting).where(DepartmentSetting.id == 1))
        if not setting:
            setting = DepartmentSetting(
                id=1,
                department_name="Department of Computer Science & Software Engineering",
                academic_session="Fall 2025 - Spring 2026",
                max_group_size=3,
                max_supervisor_quota=5,
                allow_student_self_proposal=True,
                similarity_threshold_pct=20,
            )
            db.add(setting)

        # 4. Seed Official 5 Department Milestones (100% total weight)
        # 1. Proposal Defense (Weight 10%)
        # 2. Software Requirements Specification (Weight 15%)
        # 3. Mid-Term Architecture Defense (Weight 25%)
        # 4. Final Implementation & Code Audit (Weight 30%)
        # 5. External Viva & Thesis Defense (Weight 20%)
        official_milestones = [
            {
                "phase": "Phase 1",
                "milestone": "Project Proposal Defense",
                "deadline": "20 Sep 2026",
                "submission_weight": "10%",
                "status": "Upcoming",
                "compliance": "Scheduled",
                "order_index": 1,
            },
            {
                "phase": "Phase 2",
                "milestone": "Software Requirements Specification (SRS)",
                "deadline": "10 Oct 2026",
                "submission_weight": "15%",
                "status": "Upcoming",
                "compliance": "Scheduled",
                "order_index": 2,
            },
            {
                "phase": "Phase 3",
                "milestone": "Mid-Term Architecture Defense",
                "deadline": "20 Nov 2026",
                "submission_weight": "25%",
                "status": "Upcoming",
                "compliance": "Scheduled",
                "order_index": 3,
            },
            {
                "phase": "Phase 4",
                "milestone": "Final Implementation & Code Audit",
                "deadline": "15 Mar 2027",
                "submission_weight": "30%",
                "status": "Upcoming",
                "compliance": "Scheduled",
                "order_index": 4,
            },
            {
                "phase": "Phase 5",
                "milestone": "External Viva & Thesis Defense",
                "deadline": "25 May 2027",
                "submission_weight": "20%",
                "status": "Upcoming",
                "compliance": "Final Gate",
                "order_index": 5,
            },
        ]

        # Sync milestones in database
        db_milestones = db.scalars(select(Milestone).order_by(Milestone.order_index)).all()
        if len(db_milestones) != len(official_milestones):
            for old_m in db_milestones:
                db.delete(old_m)
            db.flush()
            for m_data in official_milestones:
                db.add(Milestone(**m_data))
        else:
            for idx, m_data in enumerate(official_milestones):
                existing_m = db_milestones[idx]
                existing_m.phase = m_data["phase"]
                existing_m.milestone = m_data["milestone"]
                existing_m.submission_weight = m_data["submission_weight"]
                existing_m.deadline = m_data["deadline"]
                existing_m.order_index = m_data["order_index"]
                existing_m.compliance = m_data["compliance"]

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()
