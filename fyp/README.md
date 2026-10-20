# FYPTrack — Intelligent Final Year Project Management System

**FYPTrack** is a full-stack, enterprise-grade Final Year Project (FYP) management platform built for university academic departments (Computer Science, Software Engineering, AI, and Information Technology). It connects and synchronizes all three core stakeholders — **Students**, **Faculty Supervisors**, and the **FYP Coordinator** — into a unified, real-time workflow backed by a persistent relational database.

---

## 📑 Table of Contents
1. [System Overview & Real-World Purpose](#1-system-overview--real-world-purpose)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture & Database Design](#3-system-architecture--database-design)
4. [Role-Based Access Control (RBAC) & Features](#4-role-based-access-control-rbac--features)
   * [Student Portal](#student-portal-8-pages)
   * [Supervisor Portal](#supervisor-portal-10-pages)
   * [Coordinator Portal](#coordinator-portal-10-pages)
5. [End-to-End Live Workflow & Testing Guide](#5-end-to-end-live-workflow--testing-guide)
6. [Complete REST API Reference](#6-complete-rest-api-reference)
7. [Installation & Local Deployment Guide](#7-installation--local-deployment-guide)
8. [Project Directory Structure](#8-project-directory-structure)

---

## 1. System Overview & Real-World Purpose

In academic institutions, managing final year capstone projects via informal channels (emails, WhatsApp, Google Drive, paper forms, and disparate spreadsheets) leads to severe operational bottlenecks:
* **Untracked Deliverables:** Loss of official SRS documents, architecture specs, and code submissions across faculty email inboxes.
* **Unbalanced Faculty Workload:** Some professors are overwhelmed with 8+ groups while others supervise few or none.
* **Lack of Accountability & Traceability:** Students and supervisors dispute feedback deadlines and continuous assessment marks.
* **Coordinator Blindness:** Department heads and coordinators lack a bird's-eye view of project completion rates and defense readiness.

**FYPTrack solves these challenges** by establishing a single source of truth where:
1. Every proposal, review, document, feedback message, and evaluation score is recorded permanently in the backend database.
2. File deliverables are uploaded directly to the server with versioning and can be downloaded by supervisors for offline inspection.
3. Live status updates propagate across all user portals instantly.

---

## 2. Technology Stack

### Frontend Architecture
* **React 19 & Vite 8:** High-speed development with instant Hot Module Replacement (HMR) and optimized production builds.
* **React Router v7:** Declarative client-side routing, protected routes based on authenticated role permissions, and persistent layout outlets.
* **Tailwind CSS & Custom Design System:** Clean institutional aesthetic utilizing curated typography (`Bricolage Grotesque` and `Plus Jakarta Sans`), CSS variables, glassmorphic cards, and responsive tables.
* **Recharts:** Interactive SVG charts (Cohort Area Charts, Progress Donut Gauges, Workload Distribution Bars).
* **Lucide React:** Lightweight, accessible SVG iconography.
* **Custom Floating Toast System:** Non-intrusive animated feedback banners (`useToast`) replacing browser `alert()` popups.

### Backend Architecture
* **FastAPI (Python 3.10+):** High-throughput, asynchronous RESTful API framework with automatic interactive Swagger documentation (`/docs`).
* **SQLAlchemy 2.0 ORM:** Modern relational database abstraction with typed models and robust session management.
* **SQLite (`fyptrack.db`):** Embedded, zero-configuration ACID-compliant SQL database, pre-seeded with initial academic faculty, students, and coordinators.
* **Security & Auth:**
  * **Passlib (Bcrypt):** Salted password hashing for credentials security.
  * **Python-JOSE:** Cryptographic JSON Web Tokens (JWT) containing role claims and expiration timestamps.
* **File Processing:** Python `multipart` stream handler storing student deliverables on server disk (`backend/uploads/`) and serving secure downloads via `FileResponse`.

---

## 3. System Architecture & Database Design

### Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────┐
│              User               │
├─────────────────────────────────┤
│ id (PK)                         │
│ full_name                       │
│ email (Unique)                  │
│ role (student|supervisor|coord) │
│ department                      │
└────────────────┬────────────────┘
                 │ 1
                 │
                 │ *
┌────────────────┴────────────────┐       1    * ┌─────────────────────────────┐
│             Project             ├─────────────►│          Document           │
├─────────────────────────────────┤              ├─────────────────────────────┤
│ id (PK)                         │              │ id (PK)                     │
│ title                           │              │ project_id (FK)             │
│ abstract                        │              │ file_name, file_path        │
│ domain, tech_stack              │              │ doc_type, version, status   │
│ status                          │              │ supervisor_comment          │
│ student_id (FK -> User)         │              └─────────────────────────────┘
│ supervisor_id (FK -> User)       │
│ coordinator_status              │       1    * ┌─────────────────────────────┐
│ current_stage                   ├─────────────►│          Feedback           │
└────────────────┬────────────────┘              ├─────────────────────────────┤
                 │                               │ id (PK), project_id (FK)    │
                 │ 1                             │ sender_id, sender_name      │
                 │                               │ sender_role, message        │
                 │ *                             └─────────────────────────────┘
┌────────────────┴────────────────┐
│           Evaluation            │       1    * ┌─────────────────────────────┐
├─────────────────────────────────┤ ◄────────────┤        Notification         │
│ id (PK)                         │ (User ID)    ├─────────────────────────────┤
│ project_id (FK), supervisor_id  │              │ id (PK), user_id (FK)       │
│ phase, scores (JSON), total     │              │ title, message, is_read     │
└─────────────────────────────────┘              └─────────────────────────────┘
```

### Key Models in `backend/models/`:
1. **`User` (`models/user.py`):** Holds user credentials, department, and role (`student`, `supervisor`, `coordinator`).
2. **`Project` (`models/project.py`):** Represents an FYP project. Tracks title, abstract, tech stack, domain, student owner, assigned supervisor, submission status (`Submitted`, `Under Review`, `Approved`, `Changes Requested`), and coordinator sign-off status.
3. **`Document` (`models/document.py`):** Tracks file submissions (SRS, Design Document, Code Zip, Thesis). Holds file path on server, version number, size, verification status (`Pending`, `Approved`, `Changes Requested`), and supervisor evaluation remarks.
4. **`Feedback` (`models/feedback.py`):** Threaded project conversations between students and supervisors.
5. **`Evaluation` (`models/evaluation.py`):** Rubric-based marks entries with criteria breakdown (Literature, SRS/Design, Implementation, Defense), totals, and confidential committee feedback.
6. **`Notification` (`models/notification.py`):** System notifications dispatched on proposal submission, supervisor assignment, document upload, and review decisions.

---

## 4. Role-Based Access Control (RBAC) & Features

### Student Portal (8 Pages)
| Page | URL Route | Core Capabilities |
| :--- | :--- | :--- |
| **Dashboard** | `/student/dashboard` | Live project overview, assigned supervisor badge, submission status, completion progress. |
| **My Proposal** | `/student/proposal` | Form to draft and submit new FYP proposal (Title, Abstract, Domain, Tech Stack) directly to database. |
| **My Project** | `/student/project` | Detailed view of the group's approved project, GitHub repo link, and assigned supervisor. |
| **Milestones** | `/student/milestones` | 5-stage timeline from Proposal Defense to Final External Defense. |
| **Documents** | `/student/documents` | Upload real deliverable files (PDF, ZIP, DOCX) to server; view review status and supervisor notes. |
| **Feedback** | `/student/feedback` | Live chat thread with supervisor; send queries and receive revision instructions. |
| **Notifications** | `/student/notifications` | Feed of system alerts when proposal is approved, supervisor assigned, or documents verified. |
| **Profile** | `/student/profile` | Student academic credentials, registration number, and department. |

---

### Supervisor Portal (10 Pages)
| Page | URL Route | Core Capabilities |
| :--- | :--- | :--- |
| **Overview** | `/supervisor/overview` | Supervised groups counter, pending review queue, cohort progress chart. |
| **My Students** | `/supervisor/students` | Roster of students under supervision with search, status filters, and progress bars. |
| **My Projects** | `/supervisor/projects` | Cards for all assigned projects showing group name, tech stack, and current milestone. |
| **Proposal Reviews** | `/supervisor/proposals` | Review proposals submitted by student groups, inspect abstracts, and provide academic endorsement or revision requests. |
| **Document Reviews** | `/supervisor/documents` | Inspect submitted student deliverables; download file directly from server; approve or request corrections with notes. |
| **Milestones** | `/supervisor/milestones` | Sign off on completed milestone phases. |
| **Evaluations & Marks** | `/supervisor/evaluations` | Official rubric grading across 4 criteria (30 marks total) saved directly to database. |
| **Feedback** | `/supervisor/feedback` | Reply to student inquiries and issue formal milestone guidance. |
| **Notifications** | `/supervisor/notifications` | Submission alerts when students upload new files or submit proposals. |
| **Profile** | `/supervisor/profile` | Faculty credentials, supervision capacity (e.g. 4/5 groups), and research domains. |

---

### Coordinator Portal (10 Pages)
| Page | URL Route | Core Capabilities |
| :--- | :--- | :--- |
| **Overview** | `/coordinator/overview` | Department-wide analytics, project pipeline funnel, faculty workload distribution, and decision queue. |
| **Proposal Decisions** | `/coordinator/proposals` | Central committee review board; ratify (`Approved`), reject, or request revisions on proposals across all groups. |
| **Supervisor Allocation** | `/coordinator/supervisors` | Assign supervisors to newly submitted projects based on expertise and workload quota balance. |
| **Topic Originality** | `/coordinator/similarity` | Inspection dashboard cross-referencing proposals against department archives to prevent duplicate projects. |
| **Projects Master Registry**| `/coordinator/projects` | Department-wide registry of all active projects with search, domain filtering, and progress status. |
| **Student Registry** | `/coordinator/students` | Master list of all registered candidates, checking credit hours and defense eligibility. |
| **Deadlines & Calendar** | `/coordinator/milestones` | Set submission deadlines for Proposal, Mid-term, SRS, and Final Defense with broadcast alerts. |
| **Accreditation Reports**| `/coordinator/reports` | Export performance summaries, grade distribution, and ABET/HEC accreditation documentation. |
| **Department Circulars** | `/coordinator/notifications` | Broadcast official memos to all students and faculty. |
| **Settings & Policies** | `/coordinator/profile` | Configure max group size, faculty supervision limits, and departmental parameters. |

---

## 5. End-to-End Live Workflow & Testing Guide

You can test the entire interconnected lifecycle simultaneously using three different browser windows (or an Incognito window and standard window):

```
┌─────────────────┐       1. Submits Proposal       ┌────────────────────┐
│ Student Portal  ├────────────────────────────────►│ Coordinator Portal │
└────────┬────────┘                                 └─────────┬──────────┘
         │                                                    │
         │                               2. Assigns Supervisor│
         │                                  & Ratifies Project│
         │                                                    ▼
         │        3. Uploads Deliverables           ┌────────────────────┐
         └─────────────────────────────────────────►│ Supervisor Portal  │
                  4. Inspects & Downloads File ◄────┤                    │
                  5. Evaluates & Enters Marks  ◄────┤                    │
                  6. Interactive Feedback Chat ◄───►│                    │
                                                    └────────────────────┘
```

### Pre-Configured Test Accounts

| Role | Email | Password | Pre-Seeded Name |
| :--- | :--- | :--- | :--- |
| **Student** | `storyreal208@gmail.com` | `Password123!` | Mudassar Gill |
| **Supervisor** | `supervisor@university.edu` | `Password123!` | Dr. Imran Shah |
| **Coordinator** | `coordinator@university.edu` | `Password123!` | Prof. Dr. Tariq Mahmood |

*(Note: You can also register any new student directly via `/signup`).*

---

### Step-by-Step Testing Procedure

#### Step 1: Submit Proposal (Student)
1. Open `http://localhost:5173/login` in Browser 1.
2. Login with student credentials (`storyreal208@gmail.com` / `Password123!`).
3. Navigate to **My Proposal** (`/student/proposal`).
4. Fill in the Title, Domain (e.g. *Artificial Intelligence*), Tech Stack, and Abstract.
5. Click **Submit Proposal**. A floating toast confirms submission and the proposal status changes to `Submitted`.

#### Step 2: Assign Supervisor & Ratify (Coordinator)
1. Open `http://localhost:5173/login` in Browser 2 (or Incognito).
2. Login as coordinator (`coordinator@university.edu` / `Password123!`).
3. Navigate to **Allocations** (`/coordinator/supervisors`).
4. Locate the newly submitted project in the unallocated list.
5. Select **Dr. Imran Shah** from the supervisor dropdown and click **Assign**.
6. Navigate to **Proposals** (`/coordinator/proposals`).
7. Click **Ratify Proposal** (`Approved`). The decision is recorded in the database.

#### Step 3: Upload Project Deliverable (Student)
1. In Browser 1 (Student Portal), navigate to **Documents** (`/student/documents`).
2. Select Document Type (e.g. *Software Requirements Specification (SRS)*) and Version (`v1.0`).
3. Choose any file from your computer (PDF, Word doc, ZIP, etc.) and click **Upload Deliverable**.
4. The file is uploaded to the backend server's `backend/uploads/` directory and appears in your documents table with status `Pending`.

#### Step 4: Inspect & Approve Deliverable (Supervisor)
1. Open `http://localhost:5173/login` in Browser 3 (or switch user).
2. Login as supervisor (`supervisor@university.edu` / `Password123!`).
3. Navigate to **Document Reviews** (`/supervisor/documents`).
4. The uploaded file is displayed with the student's name, group, and submission timestamp.
5. Click **Download File** to download the exact file from the server.
6. Click **Review Deliverable**, enter review feedback (e.g., *"Architecture and functional requirements meet standard."*), and click **Approve Deliverable**.
7. The status updates to `Approved` in the database. Switch back to the Student Documents tab to confirm the real-time status update!

#### Step 5: Enter Continuous Evaluation Marks (Supervisor)
1. As Supervisor, navigate to **Evaluations & Marks** (`/supervisor/evaluations`).
2. Select the group and evaluation phase (*Proposal Defense* or *SRS Evaluation*).
3. Score criteria using the rubric sliders/inputs (Literature Review, SRS & Architecture, Implementation, Defense).
4. Enter confidential committee remarks and click **Submit Evaluation Marks**.
5. Total score (out of 30 marks) is saved to the database.

#### Step 6: Interactive Feedback Discussion
1. In Student Portal, go to **Feedback** (`/student/feedback`).
2. Post a question: *"Dear Supervisor, we have started the implementation phase. Please review the database schema."*
3. In Supervisor Portal, go to **Feedback** (`/supervisor/feedback`).
4. View the student's message and send an instant reply. The thread persists in the SQLite database.

---

## 6. Complete REST API Reference

All backend endpoints are prefixed with `/api` and documentable interactively at `http://localhost:8000/docs`.

### Authentication Endpoints (`routes/auth.py`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user credentials, returns JWT bearer token & user info. |
| `POST` | `/api/auth/signup` | Student registration with automatic role assignment. |
| `GET` | `/api/auth/me` | Fetch authenticated user profile from token claims. |

### Projects & Proposals (`routes/projects.py`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects/my` | Get projects associated with current logged-in user. |
| `GET` | `/api/projects/all` | Get all departmental projects (Coordinator/Audit scope). |
| `POST` | `/api/projects/` | Create & submit a new FYP project proposal. |
| `POST` | `/api/projects/{id}/assign-supervisor` | Assign faculty supervisor to project. |
| `POST` | `/api/projects/{id}/supervisor-decision` | Record supervisor proposal endorsement/revision decision. |
| `POST` | `/api/projects/{id}/coordinator-decision`| Record binding coordinator ratification decision. |

### Documents & Deliverables (`routes/documents.py`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/documents/upload` | Multipart file upload; saves file to server disk and records metadata. |
| `GET` | `/api/documents/review-list` | Fetch all student documents for supervisor review with group & project info. |
| `GET` | `/api/documents/project/{project_id}` | Fetch all deliverable versions for a specific project. |
| `GET` | `/api/documents/download/{id}` | Stream file download from server disk. |
| `POST` | `/api/documents/{id}/review` | Record supervisor verification status (`Approved` / `Changes Requested`) and comments. |

### Feedback & Discussions (`routes/feedback.py`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/feedback/project/{project_id}` | Fetch threaded discussion for a project. |
| `POST` | `/api/feedback/` | Post new message or guidance note. |

### Evaluations & Marks (`routes/evaluations.py`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/evaluations/project/{project_id}` | Get evaluation records and rubric scores for a project. |
| `POST` | `/api/evaluations/` | Submit rubric assessment marks and committee notes. |

---

## 7. Installation & Local Deployment Guide

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **Python:** v3.10 or higher
* **Git**

---

### Step 1: Clone Repository
```bash
git clone https://github.com/MudassarGill/FYPTrack.git
cd FYPTrack
```

---

### Step 2: Backend Setup
```bash
cd fyp/backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic python-jose passlib bcrypt python-multipart

# Start FastAPI backend server
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
> The database (`fyptrack.db`) and demo accounts are automatically initialized and seeded on first startup.
> API Documentation: Visit `http://127.0.0.1:8000/docs`.

---

### Step 3: Frontend Setup
Open a new terminal window:
```bash
cd fyp

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
> Open your browser at `http://localhost:5173`.

---

## 8. Project Directory Structure

```
FYPTrack/
├── README.md                          # Master Project Documentation
└── fyp/
    ├── .env                           # Frontend environment configuration
    ├── .env.example                   # Template for environment settings
    ├── package.json                   # React 19 dependencies & scripts
    ├── vite.config.js                 # Vite bundler configuration
    ├── src/
    │   ├── assets/                    # University logos, illustrations, graphics
    │   ├── components/
    │   │   ├── Auth/                  # Login, Signup, AuthLayout components
    │   │   └── shared/                # Badge, Card, StatCard, Toast, PageHeader, Navbar, Footer
    │   ├── layouts/
    │   │   ├── StudentLayout.jsx      # Student portal frame & navigation
    │   │   ├── SupervisorLayout.jsx   # Supervisor portal frame & navigation
    │   │   └── CoordinatorLayout.jsx  # Coordinator portal frame & navigation
    │   ├── pages/
    │   │   ├── Home.jsx               # Public university landing page
    │   │   ├── student/               # 8 Student portal views
    │   │   ├── supervisor/            # 10 Supervisor portal views
    │   │   └── coordinator/           # 10 Coordinator portal views
    │   ├── services/
    │   │   ├── api.js                 # Unified REST client with dual-host auto-fallback
    │   │   └── auth.js                # JWT session manager & role resolver
    │   ├── App.jsx                    # Central client router & role guard
    │   └── index.css                  # Design tokens, theme colors & font styles
    └── backend/
        ├── main.py                    # FastAPI entrypoint, CORS & DB lifecycle
        ├── core/                      # Application settings & security configs
        ├── database/                  # SQLite connection & session generator
        ├── models/                    # SQLAlchemy ORM models (User, Project, Document, Feedback, etc.)
        ├── routes/                    # REST route controllers (/auth, /projects, /documents, etc.)
        ├── schemas/                   # Pydantic request/response validation schemas
        ├── services/                  # Seed service & business logic
        ├── uploads/                   # Secure storage for student file deliverables
        └── fyptrack.db                # SQLite database
```

---

## 💡 Troubleshooting & Notes
* **Network Resolution (Dual-Host Fallback):** The frontend API client automatically tests both `localhost:8000` and `127.0.0.1:8000`. If one address is restricted by Windows loopback firewall rules, it seamlessly fails over to the other.
* **Persistent State:** If you wish to reset all database data back to clean initial demo states, delete `fyp/backend/fyptrack.db` and restart the backend server; `seed_service.py` will regenerate fresh initial accounts.
