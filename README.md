# FYPTrack — Intelligent Final Year Project Management System

**FYPTrack** is a role-based web application designed for university computer science and engineering departments to manage, track, and evaluate Final Year Projects (FYP) from initial proposal submission to final defense.

---

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [What Has Been Completed](#what-has-been-completed)
3. [Role Rules & Access Boundaries (Student vs. Supervisor)](#role-rules--access-boundaries)
4. [How to Test the System](#how-to-test-the-system)
5. [Project Structure](#project-structure)
6. [Remaining Work (Future Phases)](#remaining-work-future-phases)

---

## Technology Stack

* **Frontend:** React 19, Vite, Tailwind CSS v4, React Router v7, Recharts, Lucide React
* **Backend:** FastAPI, Python 3.10+, SQLAlchemy, SQLite (`fyptrack.db`), Bcrypt, Python-JOSE (JWT)
* **AI Architecture:** Open-source embedding pipeline (`sentence-transformers` / `all-MiniLM-L6-v2`) for semantic vector indexing, topic similarity checking, and intelligent supervisor workload matching.

---

## What Has Been Completed

### 1. Landing Page & Shared Brand Design
* **Header & Navbar:** Official circular brand logo (`fyplogo.png`), dynamic navigation that adapts based on user role (`Public`, `Student`, or `Supervisor`).
* **Hero & Stats:** Department statistics, live interactive sample project card, and direct registration CTAs.
* **Features Showcase:** Proposal management, milestone deadlines, AI matching, similarity analysis, and feedback.
* **Roles Section:** Polished 3-tier view for Students, Supervisors, and FYP Coordinators.
* **Why FYPTrack Section:** Clear visual comparison between manual legacy methods vs. FYPTrack.
* **Interactive FAQ, Contact Form & Footer:** Full brand continuity and department office details.

### 2. Authentication & Role-Based Access Control (RBAC)
* **Login & Signup:** JWT-based authentication with bcrypt password hashing.
* **Role Redirection:**
  * Logging in with a **Student** account immediately routes to `/student/dashboard`.
  * Logging in with a **Supervisor** account immediately routes to `/supervisor/overview`.
* **Protected Routes:** Unauthorized users are prevented from accessing cross-role areas, with demo mode available for UI exploration.

### 3. Student Portal (8 Pages)
1. **Overview Dashboard (`/student/dashboard`):** Project hero banner, weekly velocity AreaChart, milestone status Donut chart, deadlines, and group member info.
2. **My Proposal (`/student/proposal`):** Submission form for project title, domain, abstract, tech stack, and proposal document upload.
3. **My Project (`/student/project`):** Project details, assigned supervisor info, repository links, and team members.
4. **Milestones (`/student/milestones`):** Phase-by-phase timeline (Proposal Defense, SRS, System Design, Prototype, Final Defense).
5. **Documents (`/student/documents`):** File upload center for SRS, diagrams, presentations, and code archives.
6. **Feedback (`/student/feedback`):** Direct feedback threads received from the supervisor.
7. **Notifications (`/student/notifications`):** Alert stream for submission reviews, deadline reminders, and approvals.
8. **Profile (`/student/profile`):** Student academic profile, roll number, degree program, and contact details.

### 4. Supervisor Portal (10 Pages)
1. **Supervisor Overview (`/supervisor/overview`):**
   * Real-time metrics: Assigned Students (11), Active Projects (4), Pending Reviews (3), Upcoming Deadlines (2).
   * Recharts average cohort milestone progress chart and milestone status donut chart.
   * Pending document reviews table, upcoming group deadlines, and recent submissions stream.
   * AI Open-Source Embeddings summary card (topic fit and originality score).
2. **My Students (`/supervisor/students`):** Search by student name/roll number/group, status filters (*On Track*, *Needs Attention*, *Under Review*), progress bars, and student detail modals.
3. **My Projects (`/supervisor/projects`):** Project cards grouped by domain (*AI/ML*, *Robotics*, *IoT*, *Healthcare AI*), team members, tech stacks, and milestone pipeline trackers.
4. **Proposal Reviews (`/supervisor/proposals`):** Proposal evaluation queue with open-source AI vector similarity scores (`all-MiniLM-L6-v2`), supervisor endorsement, and revision requests.
5. **Document Reviews (`/supervisor/documents`):** Document review center (SRS, High-Level Design, Code Archives) with file downloads, feedback input, and approval/revision actions.
6. **Milestone Reviews (`/supervisor/milestones`):** Group milestone monitoring, overdue deliverable alerts, and milestone sign-off certification.
7. **Evaluations & Marks (`/supervisor/evaluations`):** Official rubric grading interface (Problem Formulation, System Design, Code Quality, Defense Q&A), individual student score inputs, auto-totals (out of 30 marks), and confidential coordinator notes.
8. **Feedback (`/supervisor/feedback`):** Work-item-attached threaded chat with student groups with instant reply support.
9. **Notifications (`/supervisor/notifications`):** Submission alerts, overdue warnings, and departmental memos with mark-as-read controls.
10. **Supervisor Profile (`/supervisor/profile`):** Academic credentials, consultation office hours, supervision capacity tracking (e.g., 4/5 groups allocated), and research domain tags for AI matching.

---

## Role Rules & Access Boundaries

| Capability / Rule | Student Role | Supervisor Role |
| :--- | :---: | :---: |
| **Public Self-Signup** |  Allowed |  Not Allowed (Department provisioned) |
| **Default Post-Login Route** | `/student/dashboard` | `/supervisor/overview` |
| **Access Other Groups' Work** |  Restricted (Own group only) |  Restricted (Assigned groups only) |
| **Submit Proposals & Files** |  Yes (Upload deliverables) |  No (Inspect & Download only) |
| **Endorse Project Proposals** |  No |  Yes (Forwards to Coordinator) |
| **Approve / Certify Milestones** |  No |  Yes |
| **Grade & Enter Marks** |  No (Can only view published marks) |  Yes (Official rubric grading) |
| **Manage Supervision Quota** |  No |  Yes (Set group capacity & office hours) |
| **AI Topic Matching Profile** |  Subject of matching |  Configures research expertise tags |

### Workflow Lifecycle Rules:
1. **Proposal Submission:** The student group submits a proposal. An open-source sentence-transformers model checks similarity against departmental project archives.
2. **Supervisor Review & Endorsement:** The assigned supervisor reviews the proposal. The supervisor can either request revisions or endorse it.
3. **Coordinator Ratification:** Only the FYP Coordinator can give final institutional approval (Supervisor endorsement is a prerequisite).
4. **Milestone Execution:** Students submit deliverables (SRS, Design, Code). The supervisor reviews files, provides inline threaded feedback, and signs off on completion.
5. **Continuous Evaluation:** The supervisor grades student defense presentations and milestone code using standardized rubrics.

---

## How to Test the System

### 1. Start Development Servers
Ensure both frontend and backend servers are running:

**Frontend (Vite):**
```bash
cd fyp
npm run dev
# Running on http://localhost:5173
```

**Backend (FastAPI):**
```bash
cd fyp/backend
python -m uvicorn main:app --reload
# Running on http://127.0.0.1:8000 (Docs at http://127.0.0.1:8000/docs)
```

---

### 2. Testing Credentials

#### A. Supervisor Account (Pre-Seeded)
* **URL:** `http://localhost:5173/login`
* **Email:** `imran.shah@university.edu` *(or `supervisor@university.edu`)*
* **Password:** `Password123!`
* **Expected Result:**
  * Login succeeds.
  * System immediately navigates to `/supervisor/overview`.
  * The top navbar displays supervisor links: **Overview**, **My Students**, **My Projects**, **Proposals**, **Documents**, and **More** dropdown (*Milestones*, *Evaluations*, *Feedback*, *Notifications*, *Profile*).
  * Avatar circle displays `IS` (Dr. Imran Shah).

#### B. Student Account (Pre-Seeded or New Signup)
* **URL:** `http://localhost:5173/login`
* **Email:** `storyreal208@gmail.com` *(or create any new student via `/signup`)*
* **Password:** `Password123!` *(or your chosen password upon signup)*
* **Expected Result:**
  * Login succeeds.
  * System immediately navigates to `/student/dashboard`.
  * The top navbar displays student links: **Dashboard**, **My Proposal**, **My Project**, **Milestones**, **Documents**, and **More** dropdown.
  * Avatar circle displays student initials.

---

### 3. Direct Route Testing (Demo Mode)
If you wish to inspect pages directly in your browser without logging in:
* **Supervisor Overview:** `http://localhost:5173/supervisor/overview`
* **Supervisor Students:** `http://localhost:5173/supervisor/students`
* **Supervisor Projects:** `http://localhost:5173/supervisor/projects`
* **Supervisor Proposal Reviews:** `http://localhost:5173/supervisor/proposals`
* **Supervisor Document Reviews:** `http://localhost:5173/supervisor/documents`
* **Supervisor Milestones:** `http://localhost:5173/supervisor/milestones`
* **Supervisor Evaluations:** `http://localhost:5173/supervisor/evaluations`
* **Supervisor Feedback:** `http://localhost:5173/supervisor/feedback`
* **Supervisor Notifications:** `http://localhost:5173/supervisor/notifications`
* **Supervisor Profile:** `http://localhost:5173/supervisor/profile`

---

## Project Structure

```
FYPTrack/
├── fyp/
│   ├── src/
│   │   ├── assets/              # Logo (fyplogo.png), stock visuals, icons
│   │   ├── components/
│   │   │   ├── Auth/            # Login, Signup, Forgot/Reset Password, Branding
│   │   │   ├── shared/          # Navbar, Footer, Badge, Card, StatCard, PageHeader
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layouts/
│   │   │   ├── StudentLayout.jsx      # Student portal layout
│   │   │   └── SupervisorLayout.jsx   # Supervisor portal layout
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Public landing page
│   │   │   ├── student/         # 8 Student portal pages
│   │   │   └── supervisor/      # 10 Supervisor portal pages
│   │   ├── services/
│   │   │   └── auth.js          # Authentication API service & token storage
│   │   ├── App.jsx              # Main routing configuration
│   │   └── index.css            # Design tokens, theme styling, cards & badges
│   └── backend/
│       ├── database/            # SQLite engine & Base setup
│       ├── models/              # User ORM model with role column
│       ├── routes/              # Auth routes (/api/auth/login, signup, me)
│       ├── services/            # JWT token creation & bcrypt password hashing
│       ├── fyptrack.db          # SQLite database containing seeded users
│       └── main.py              # FastAPI application entry point
└── README.md
```

---

## Remaining Work (Future Phases)

1. **FYP Coordinator Portal (Phase 3):**
   * Department-wide dashboard for monitoring all students, supervisors, and projects.
   * Final proposal approval/rejection panel.
   * AI-assisted supervisor assignment engine with load balancing.
   * Department progress analytics and exportable compliance reports.
2. **Open-Source AI Embedding Backend Service (Phase 4):**
   * Integration of Python `sentence-transformers` (`all-MiniLM-L6-v2`) in FastAPI.
   * Vector database / FAISS index for real-time document similarity and plagiarism detection.
3. **Database Schema Expansion (Phase 5):**
   * Dedicated SQLite/PostgreSQL relational tables for `proposals`, `projects`, `milestones`, `submissions`, `evaluations`, and `feedback_threads`.
