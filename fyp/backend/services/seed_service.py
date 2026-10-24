from sqlalchemy import select
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
        supervisor_objects = {}
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
                db.flush()
            supervisor_objects[name] = s

        # 3. Seed Students
        students_data = [
            ("Hamza Tariq", "student@university.edu"),
            ("Ayesha Noor", "ayesha.noor@university.edu"),
            ("Bilal Farooq", "bilal.farooq@university.edu"),
            ("Hassan Raza", "hassan.raza@university.edu"),
            ("Usman Tariq", "usman.tariq@university.edu"),
            ("Zubair Ahmad", "zubair.ahmad@university.edu"),
        ]
        student_objects = {}
        for name, email in students_data:
            st = db.scalar(select(User).where(User.email == email))
            if not st:
                st = User(
                    full_name=name,
                    email=email,
                    password_hash=hash_password("password123"),
                    role="student",
                )
                db.add(st)
                db.flush()
            student_objects[name] = st

        db.commit()

        # 4. Seed Projects
        projects_data = [
            {
                "student_name": "Hamza Tariq",
                "group_name": "Group 14",
                "title": "Crop Price Prediction and Market Advisory System",
                "domain": "Machine Learning",
                "abstract": "A deep learning and time-series model analyzing historical mandi arrival volumes and weather metrics to predict future wholesale market price fluctuations for seasonal crops.",
                "technologies": "Python, FastAPI, PyTorch, React, PostgreSQL",
                "group_members": "Hamza Tariq (Lead), Ayesha Noor, Zainab Ali",
                "status": "Approved by Supervisor",
                "supervisor_name": "Dr. Imran Shah",
                "coordinator_status": "Pending Decision",
                "originality_score": 94,
                "version": 2,
            },
            {
                "student_name": "Bilal Farooq",
                "group_name": "Group 08",
                "title": "Autonomous Campus Shuttle Navigation & Obstacle Avoidance",
                "domain": "Robotics & Embedded",
                "abstract": "LiDAR and computer vision pipeline for automated lane tracking and dynamic obstacle avoidance on university ring road pathways.",
                "technologies": "ROS 2, Python, OpenCV, C++, Jetson Nano",
                "group_members": "Bilal Farooq (Lead), Sara Ahmed",
                "status": "Submitted",
                "supervisor_name": "Dr. Noman Ali",
                "coordinator_status": "Pending Decision",
                "originality_score": 98,
                "version": 1,
            },
            {
                "student_name": "Hassan Raza",
                "group_name": "Group 21",
                "title": "Smart Grid Load Balancer & Energy Anomaly Detection",
                "domain": "Distributed Systems",
                "abstract": "High-throughput edge stream processing framework balancing distributed solar microgrid distribution and flagging phase anomalies.",
                "technologies": "Go, Apache Kafka, InfluxDB, React, Docker",
                "group_members": "Hassan Raza (Lead), Mariam Khan",
                "status": "Approved by Coordinator",
                "supervisor_name": "Dr. Imran Shah",
                "coordinator_status": "Approved",
                "originality_score": 91,
                "version": 1,
            },
            {
                "student_name": "Usman Tariq",
                "group_name": "Group 33",
                "title": "Federated Learning for Medical Imaging Privacy",
                "domain": "Cybersecurity & AI",
                "abstract": "Decentralized privacy-preserving neural network training framework over multi-hospital magnetic resonance imaging datasets.",
                "technologies": "Python, PySyft, PyTorch, FastAPI",
                "group_members": "Usman Tariq (Lead)",
                "status": "Submitted",
                "supervisor_name": None,
                "coordinator_status": "Pending Decision",
                "originality_score": 96,
                "version": 1,
            },
            {
                "student_name": "Zubair Ahmad",
                "group_name": "Group 42",
                "title": "Blockchain Powered Degree Verification Protocol",
                "domain": "Cybersecurity",
                "abstract": "Smart contract infrastructure on EVM rollups to store cryptographic attestations of university degrees for instant employer verification.",
                "technologies": "Solidity, Ethereum, Ethers.js, React",
                "group_members": "Zubair Ahmad (Lead)",
                "status": "Submitted",
                "supervisor_name": None,
                "coordinator_status": "Pending Decision",
                "originality_score": 76,
                "version": 1,
            },
        ]

        created_projects = {}
        for pdata in projects_data:
            lead_user = student_objects.get(pdata["student_name"])
            existing_p = db.scalar(select(Project).where(Project.group_name == pdata["group_name"]))
            if not existing_p and lead_user:
                sup_obj = supervisor_objects.get(pdata["supervisor_name"]) if pdata["supervisor_name"] else None
                new_p = Project(
                    student_id=lead_user.id,
                    student_name=lead_user.full_name,
                    student_email=lead_user.email,
                    group_name=pdata["group_name"],
                    title=pdata["title"],
                    domain=pdata["domain"],
                    abstract=pdata["abstract"],
                    technologies=pdata["technologies"],
                    group_members=pdata["group_members"],
                    status=pdata["status"],
                    supervisor_id=sup_obj.id if sup_obj else None,
                    supervisor_name=pdata["supervisor_name"],
                    coordinator_status=pdata["coordinator_status"],
                    originality_score=pdata["originality_score"],
                    version=pdata["version"],
                )
                db.add(new_p)
                db.flush()
                created_projects[pdata["group_name"]] = new_p
            elif existing_p:
                created_projects[pdata["group_name"]] = existing_p

        db.commit()

        # 5. Seed Feedback Thread for Group 14
        p14 = created_projects.get("Group 14")
        imran = supervisor_objects.get("Dr. Imran Shah")
        hamza = student_objects.get("Hamza Tariq")
        if p14 and imran and hamza:
            f_count = db.scalar(select(Feedback).where(Feedback.project_id == p14.id).limit(1))
            if not f_count:
                f1 = Feedback(
                    project_id=p14.id,
                    from_user_id=imran.id,
                    from_user_name="Dr. Imran Shah",
                    from_role="supervisor",
                    to_user_id=hamza.id,
                    message="Initial methodology outline looks promising. Please expand Section 3 on dataset preprocessing and mandi arrival frequency.",
                    action_type="revision_request",
                )
                f2 = Feedback(
                    project_id=p14.id,
                    from_user_id=hamza.id,
                    from_user_name="Hamza Tariq",
                    from_role="student",
                    to_user_id=imran.id,
                    message="Thank you Dr. Imran. We have revised Section 3 and included historical arrival data from 12 Punjab mandi hubs in our new draft.",
                    action_type="comment",
                )
                db.add_all([f1, f2])

        # 6. Seed Evaluations for Group 14
        if p14 and imran:
            ev_count = db.scalar(select(Evaluation).where(Evaluation.project_id == p14.id).limit(1))
            if not ev_count:
                ev1 = Evaluation(
                    project_id=p14.id,
                    supervisor_id=imran.id,
                    student_name="Hamza Tariq",
                    roll_number="FA20-BSE-058",
                    criteria1=8,
                    criteria2=9,
                    criteria3=4,
                    criteria4=4,
                    total_marks=25,
                    remarks="Excellent methodology formulation and proactive progress on dataset preparation.",
                )
                db.add(ev1)

        # 7. Seed Sample Deliverable Document
        if p14 and hamza:
            doc_count = db.scalar(select(Document).where(Document.project_id == p14.id).limit(1))
            if not doc_count:
                d1 = Document(
                    project_id=p14.id,
                    student_id=hamza.id,
                    file_name="SRS_Specification_Group14.pdf",
                    file_path="uploads/SRS_Specification_Group14.pdf",
                    file_size="2.4 MB",
                    file_format="PDF",
                    doc_type="Software Requirements Specification (SRS)",
                    version="v1.0",
                    status="Approved",
                    supervisor_comment="Well specified functional requirements. Approved to proceed with system architecture.",
                )
                db.add(d1)

        # 8. Seed Notifications
        if hamza:
            notif_count = db.scalar(select(Notification).where(Notification.user_id == hamza.id).limit(1))
            if not notif_count:
                n1 = Notification(
                    user_id=hamza.id,
                    title="Supervisor Assigned",
                    message="Dr. Imran Shah has been assigned as your FYP supervisor by the Coordinator.",
                )
                n2 = Notification(
                    user_id=hamza.id,
                    title="Document Review Completed",
                    message="Dr. Imran Shah approved your SRS Specification document with commendation.",
                )
                db.add_all([n1, n2])

        # 9. Seed Milestones if empty
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
        print("Database verification & rich seed completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()
