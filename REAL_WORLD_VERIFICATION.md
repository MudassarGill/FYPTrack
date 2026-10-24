# FYPTrack — Real-World University Verification & Deployment Guide

This guide provides end-to-end instructions for testing and validating **FYPTrack** for real-world university deployment across the **Student**, **Supervisor**, and **Coordinator** portals.

---

## 1. Verified System Credentials (Active in Database)

All three institutional roles are pre-seeded in the local database with verified credentials:

| Role | Name | Email | Password | Academic Scope / Department |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | Hamza Tariq | `student@university.edu` | `student123` | BS Software Engineering (Group 14 Lead) |
| **Supervisor** | Dr. Imran Shah | `supervisor@university.edu` | `super123` | Associate Professor, Machine Learning & AI |
| **Supervisor** | Dr. Sadia Malik | `sadia.malik@university.edu` | `super123` | Assistant Professor, Cybersecurity & Distributed Systems |
| **Coordinator** | Prof. Dr. Tariq Mahmood | `coordinator@university.edu` | `coord123` | Head of FYP Committee / Department Administration |

> **Self-Registration for Real University Students & Faculty:**
> Anyone can also register a fresh account via `/signup` by selecting their designated role (**Student** or **Supervisor**). Passwords and sessions use PBKDF2-SHA256 password hashing and JWT authentication.

---

## 2. Server Architecture & Execution

Both servers run concurrently:

1. **Backend Server (FastAPI + SQLite + NLP Engine):**
   - Path: `d:\FYPTrack\fyp\backend`
   - Command: `python -m uvicorn main:app --reload --port 8000`
   - Interactive Swagger API: `http://localhost:8000/docs`
   - SQLite Database: `d:\FYPTrack\fyp\backend\fyptrack.db`

2. **Frontend Client (React + Vite):**
   - Path: `d:\FYPTrack\fyp`
   - Command: `npm run dev`
   - Portal Access: `http://localhost:5173/`

---

## 3. Real-World University Workflow (Step-by-Step Test Plan)

Follow this 6-step flow to verify that all operations occur dynamically with real database storage:

### Step 1: Student Portal — Proposal Submission & Dynamic Members
1. Open `http://localhost:5173/login` and log in as student:
   - Email: `student@university.edu`
   - Password: `student123`
2. Navigate to **My Proposal** (`/student/proposal`).
3. Fill in your project proposal:
   - **Title**: *Autonomous Agricultural Drone for Mandi Yield Surveillance*
   - **Domain**: *Machine Learning & AI*
   - **Group Members**: Enter real member names e.g., `Ali Khan (FA21-BCS-010), Usman Tariq (FA21-BCS-045)`
   - **Abstract**: Type a detailed problem statement and methodology.
4. Click **Submit Proposal**.
5. Navigate to **Dashboard** (`/student/dashboard`):
   - **Result Verification**:
     - Card 2 (**Group Members**) now renders **strictly** the names you entered (`Ali Khan` and `Usman Tariq`) alongside your logged-in student account labeled with the `You` pill.
     - Hardcoded static demo members are completely eliminated.
     - The footer displays the exact member count dynamically (`Group 14 • 3 members`).

---

### Step 2: Coordinator Portal — Real AI Similarity & Novelty Audit
1. Open a new incognito window or log out and log in as coordinator:
   - Email: `coordinator@university.edu`
   - Password: `coord123`
2. You will land on the **Coordinator Overview** (`/coordinator/overview`):
   - Notice the **Department Project Pipeline** and **Faculty Workload & Quota** charts render cleanly with zero clipping.
3. In the navigation bar, click **Similarity** (`/coordinator/similarity`):
   - **Audit Queue Tab**: View all active proposals. Click any proposal to open the **NLP Vector Diff Inspector**.
   - Notice the side-by-side comparison:
     - Left: Current student proposal abstract.
     - Right: Closest institutional archive match from the past thesis pool (2021–2025).
     - Tags: Intersecting significant terms (e.g. `mandi`, `forecasting`, `pricing`) and calculated overlap percentage.
   - **Live Proposal Scanner Tab**:
     - Paste any test proposal text.
     - Click **Run Live Similarity Scan**.
     - The backend computes cosine distance using TF-IDF tokenization and returns real-time similarity metrics and closest archive match.
   - **Archive Pool Tab**:
     - Inspect the institutional benchmark archive pool spanning past departmental years (2021 to 2025).

---

### Step 3: Coordinator Portal — Proposal Ratification & Supervisor Allocation
1. Click **Proposals** (`/coordinator/proposals`):
   - Filter by **Pending Decision**.
   - Click on the proposal submitted in Step 1.
   - Select **Approve Proposal** or **Request Topic Revision** and submit notes.
2. Click **Allocations** (`/coordinator/supervisors`):
   - Locate the student group under **Groups Pending Allocation**.
   - Select a faculty supervisor (e.g., **Dr. Imran Shah**).
   - Click **Allocate Supervisor**.

---

### Step 4: Real-Time Notification Verification
1. Return to the Student portal window (logged in as `student@university.edu`).
2. Without manually refreshing the page, watch the bell icon in the top navigation bar.
3. **Result Verification**:
   - Within **8 seconds**, the badge count increments automatically via periodic background polling.
   - Click the bell icon:
     - A notification appears: *"Dr. Imran Shah has been assigned as your project supervisor."*
     - A notification appears: *"Coordinator Decision Announced: Project proposal Approved."*

---

### Step 5: Supervisor Portal — Document & Milestone Reviews
1. Log in as supervisor:
   - Email: `supervisor@university.edu`
   - Password: `super123`
2. Check the **Supervisor Overview** (`/supervisor/overview`):
   - Displays real count of assigned students and supervised projects.
3. Click **Evaluations** (`/supervisor/evaluations`):
   - Select the assigned student group.
   - Input marks across the 4 official departmental criteria:
     - Problem Formulation & Scope (out of 10)
     - Technical Methodology (out of 10)
     - Implementation Progress (out of 5)
     - Presentation & Viva Defense (out of 5)
   - Add qualitative remarks and click **Save & Finalize Evaluation**.
4. Check the Student portal notifications:
   - Notification arrives: *"Supervisor has graded milestone: 27/30. Remarks: Approved."*

---

### Step 6: Milestone Calendar & Academic Compliance
1. As coordinator, navigate to **Milestones** (`/coordinator/milestones`):
   - Update any upcoming deadline (e.g. SRS or Mid-Term Evaluation date).
2. The system automatically creates broadcast deadline update notifications for all enrolled students and faculty members.

---

## 4. Institutional NLP Similarity Engine Technical Details

- **Algorithm**: TF-IDF (Term Frequency – Inverse Document Frequency) Cosine Distance.
- **Stopwords**: Standard academic and English stopword elimination with custom technical n-gram extraction (unigrams + bigrams).
- **Archive Corpus**: Indexed historical capstone dissertations from 2021 to 2025 across Machine Learning, Cybersecurity, Embedded Robotics, Healthcare AI, and Distributed Systems.
- **Thresholds**:
  - `Similarity < 10%`: Low Risk (High Novelty, green badge)
  - `10% <= Similarity < 20%`: Moderate Overlap (Requires review, amber badge)
  - `Similarity >= 20%`: High Risk (Coordinator audit flag triggered, automatic notification sent to coordinator)

---

## 5. Verification Checklist

| Item | Component | Verification Status |
| :--- | :--- | :---: |
| 1 | Hardcoded group members ("Ayesha Noor, Hamza Tariq, Zainab Ali") replaced with dynamic database group members | **PASSED** |
| 2 | Coordinator Overview dashboard loaded without crashing (charts and stages guarded) | **PASSED** |
| 3 | AI NLP Similarity checker comparing real proposals against historical benchmark pool | **PASSED** |
| 4 | Real-time live proposal testing scanner available for coordinators | **PASSED** |
| 5 | Live periodic notification polling (8s) notifying students of supervisor/coordinator actions | **PASSED** |
| 6 | Supervisor evaluations, document reviews, and proposal endorsements persisting in database | **PASSED** |
| 7 | Coordinator supervisor allocation balancing faculty capacity quotas | **PASSED** |
| 8 | Password reset and authentication flows operating against real backend endpoints | **PASSED** |
