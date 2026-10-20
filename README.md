# FYPTrack — Intelligent Final Year Project Management System

**FYPTrack** is an enterprise-grade, role-based web application engineered for university academic departments (Computer Science, Software Engineering, AI, and Data Science) to govern, track, and evaluate Final Year Projects (FYP) from initial proposal submission to final external defense.

---

## 📑 Table of Contents
1. [Project Overview & Problem Statement](#1-project-overview--problem-statement)
2. [Technology Stack & Core Architecture](#2-technology-stack--core-architecture)
3. [AI & Semantic Vector Embeddings Architecture](#3-ai--semantic-vector-embeddings-architecture)
4. [Role-Based Access Control (RBAC) & Workflow Matrix](#4-role-based-access-control-rbac--workflow-matrix)
5. [End-to-End Page & Portal Directory](#5-end-to-end-page--portal-directory)
   * [Public Landing Page](#public-landing-page)
   * [Authentication Flow](#authentication-flow)
   * [Student Portal (8 Pages)](#student-portal-8-pages)
   * [Supervisor Portal (10 Pages)](#supervisor-portal-10-pages)
   * [Coordinator Portal (10 Pages)](#coordinator-portal-10-pages)
6. [Environment Variables & Configuration](#6-environment-variables--configuration)
7. [Step-by-Step Testing Guide (All 3 Portals)](#7-step-by-step-testing-guide-all-3-portals)
8. [Codebase Structure & Reusability Design](#8-codebase-structure--reusability-design)

---

## 1. Project Overview & Problem Statement

Traditional academic departments manage Final Year Projects using disjointed spreadsheets, email threads, and WhatsApp groups. This causes:
* **Duplicate/Plagiarized Project Ideas:** Students submitting topics already completed in previous years without detection.
* **Supervisor Workload Imbalance:** Unequal student group distribution where some faculty members are overloaded while others have empty slots.
* **Scattered Deliverables & Feedback:** Revision notes, SRS documents, and code archives get lost across personal inboxes.
* **Untracked Deadlines:** Lack of department-wide compliance visibility for milestone deliverables.

**FYPTrack** resolves this by consolidating all stakeholders into three synchronized portals unified under an open-source AI semantic vector engine.

---

## 2. Technology Stack & Core Architecture

| Layer | Technologies Used | Rationale |
| :--- | :--- | :--- |
| **Frontend UI** | **React 19, Vite, Tailwind CSS v4** | Blazing-fast HMR, component reusability, modern CSS variables, zero runtime overhead. |
| **Routing** | **React Router v7** | Client-side role-based protected routing, nested layout outlets, and deep linking. |
| **Visual Analytics** | **Recharts** | Responsive SVG charts (Area, Donut, Multi-Bar) for progress tracking and workload balance. |
| **Iconography** | **Lucide React** | Clean, lightweight SVG iconography maintaining strict design continuity. |
| **Backend API** | **FastAPI (Python 3.10+)** | High-performance asynchronous REST endpoints, automatic OpenAPI documentation (`/docs`). |
| **ORM & Database** | **SQLAlchemy 2.0, SQLite (`fyptrack.db`)** | Robust relational mapping, migration flexibility, portable local database storage. |
| **Security & Auth** | **Bcrypt, Python-JOSE (JWT)** | Secure password hashing with salt, encrypted JWT token verification, stateless authorization. |
| **AI Vector Engine** | **Sentence-Transformers (`all-MiniLM-L6-v2`)** | 384-dimensional dense semantic vector embeddings for topic similarity and supervisor matching. |

---

## 3. AI & Semantic Vector Embeddings Architecture

FYPTrack utilizes an **open-source vector embedding model** (`all-MiniLM-L6-v2` via HuggingFace Sentence-Transformers):

```
[Student Proposal Abstract]
            │
            ▼
┌────────────────────────┐
│  Vector Embeddings     │  ==> 384-dimensional dense semantic vector
│  (all-MiniLM-L6-v2)   │
└────────────────────────┘
            │
      ┌─────┴────────────────────────┐
      ▼                              ▼
┌────────────────────────┐   ┌────────────────────────┐
│ Plagiarism / Archives  │   │ Supervisor Domain Match│
│ Cosine Similarity      │   │ Dot Product with       │
│ Against 450+ Theses    │   │ Faculty Expertise Tags │
└────────────────────────┘   └────────────────────────┘
```

1. **Plagiarism & Duplicate Topic Prevention:**
   * Incoming project abstracts are converted into dense vector embeddings.
   * Cosine distance is measured against hundreds of past departmental project vectors.
   * If similarity exceeds the threshold (e.g. 20%), the proposal is flagged for coordinator review.
2. **Workload & Domain Matching:**
   * Each supervisor profile contains research expertise vectors (e.g. NLP, Edge Computing, Computer Vision).
   * Unassigned student proposals are ranked by cosine similarity against supervisor profiles and current quota limits to recommend optimal academic mentors.

---

## 4. Role-Based Access Control (RBAC) & Workflow Matrix

| Capability / Permission | Student Portal | Supervisor Portal | Coordinator Portal |
| :--- | :---: | :---: | :---: |
| **Self-Registration** |  Public Allowed |  Restricted (Admin only) |  Restricted (Admin only) |
| **Default Post-Login Route** | `/student/dashboard` | `/supervisor/overview` | `/coordinator/overview` |
| **Project Data Scope** | Own group only | Assigned groups only | Department-wide (All groups) |
| **Submit Proposal / Files** |  Yes |  No (Inspect & Download) |  No (Inspect & Download) |
| **Endorse Proposals** |  No |  **Yes** (Academic feasibility) |  N/A |
| **Ratify / Approve Proposals** |  No |  No |  **Yes** (Binding institution sign-off) |
| **Milestone Sign-Off** |  No |  **Yes** (Deliverable completion) |  **Yes** (Overrides & adjustments) |
| **Official Rubric Marks Entry** |  No (View published only) |  **Yes** (Phase evaluations) |  **Yes** (Audit & lock grades) |
| **Supervisor Workload Quotas** |  No |  Views own capacity (4/5) |  **Sets & balances all quotas** |
| **Department Academic Deadlines** |  Views deadlines |  Views deadlines |  **Publishes & broadcasts dates** |
| **Accreditation Analytics Export** |  No |  No |  **Yes** (CSV / ABET PDF dossiers) |

---

## 5. End-to-End Page & Portal Directory

### Public Landing Page
* **[`/`](file:///d:/FYPTrack/fyp/src/pages/Home.jsx):**
  * **Brand Navbar:** Official circular logo (`fyplogo.png`), dynamic navigation.
  * **Hero Section:** Interactive live sample project card, direct sign-up CTAs.
  * **Stats & Features:** 6 key capability cards with image hover zoom effects.
  * **3 Roles Matrix:** Clear breakdown for Students, Supervisors, and Coordinators with customized pill badges.
  * **Why FYPTrack:** Visual comparison between traditional spreadsheet chaos vs. modern automated tracking.
  * **FAQ & Contact Form:** Accordion Q&A and direct departmental contact details.

---

### Authentication Flow
* **Login (`/login`):** Role-aware credentials form. Automatically routes users to their role portal upon authentication.
* **Sign Up (`/signup`):** Student self-registration with automatic role validation.
* **Forgot & Reset Password (`/forgot-password`, `/reset-password`):** Secure token dispatch and verification.

---

### Student Portal (8 Pages)
1. **Dashboard (`/student/dashboard`):** Project title, weekly velocity chart, milestone progress donut, upcoming deadlines, and team members.
2. **My Proposal (`/student/proposal`):** Submission form for project domain, title, abstract, tech stack, and PDF upload.
3. **My Project (`/student/project`):** Project repository links, assigned supervisor details, and phase completion indicators.
4. **Milestones (`/student/milestones`):** 5-stage timeline from Proposal Defense to Final External Defense.
5. **Documents (`/student/documents`):** Deliverable center for SRS, system architecture, test plans, and code archives.
6. **Feedback (`/student/feedback`):** Direct feedback threads received from the supervisor.
7. **Notifications (`/student/notifications`):** Alert feed for reviews, deadlines, and committee announcements.
8. **Profile (`/student/profile`):** Student academic profile, roll number, and degree program.

---

### Supervisor Portal (10 Pages)
1. **Supervisor Overview (`/supervisor/overview`):** Workload metrics (Students, Projects, Pending Reviews, Deadlines), Recharts cohort progress area chart, milestone donut chart, pending review queue, and AI vector summary card.
2. **My Students (`/supervisor/students`):** Roster of supervised students with search, status filters (*On Track*, *Needs Attention*, *Under Review*), progress bars, and detail modal.
3. **My Projects (`/supervisor/projects`):** Project cards grouped by domain, student team members, tech stacks, and milestone pipeline trackers.
4. **Proposal Reviews (`/supervisor/proposals`):** AI vector similarity check (`all-MiniLM-L6-v2`), endorsement actions, and revision request forms.
5. **Document Reviews (`/supervisor/documents`):** File review workspace (SRS, Design, Code Archives) with file downloads and approval/revision actions.
6. **Milestone Reviews (`/supervisor/milestones`):** Group milestone monitoring, overdue deliverable alerts, and milestone sign-off certification.
7. **Evaluations & Marks (`/supervisor/evaluations`):** Official rubric scoring across 4 criteria, individual student marks inputs, auto-totals (out of 30 marks), and confidential committee remarks.
8. **Feedback (`/supervisor/feedback`):** Deliverable-attached threaded chat with student groups with instant reply support.
9. **Notifications (`/supervisor/notifications`):** Submission alerts, deadline reminders, and memos with mark-as-read controls.
10. **Supervisor Profile (`/supervisor/profile`):** Academic credentials, office hours, supervision quota tracking (e.g., 4/5 groups allocated), and research domain tags for AI matching.

---

### Coordinator Portal (10 Pages)
1. **Coordinator Overview (`/coordinator/overview`):** Department-wide project pipeline funnel chart, faculty workload balance chart, pending proposal decision queue, and AI vector archive index card.
2. **Proposal Decisions (`/coordinator/proposals`):** Institutional review board for all 48 department proposals with filters, supervisor notes, and binding Ratify / Reject / Request Revision decisions.
3. **AI Supervisor Allocation (`/coordinator/supervisors`):** Open-source AI semantic topic matching between proposals and faculty research tags, paired with workload quota balancers.
4. **Vector Similarity Sentinel (`/coordinator/similarity`):** Side-by-side semantic diff inspector comparing new 2026 proposals against 450+ archived historical theses with clear/flag actions.
5. **Projects Master Registry (`/coordinator/projects`):** Department-wide project directory with domain filters, current stage, supervisor, progress bars, and defense eligibility status.
6. **Student Registry (`/coordinator/students`):** Master roster of all 142 candidates across degree programs, checking credit completion (e.g. 128/136) and defense eligibility.
7. **Deadlines & Academic Calendar (`/coordinator/milestones`):** Department milestone timeline, submission weightages, date adjustment modals, and broadcast reminder dispatch.
8. **Analytics & Accreditation Reports (`/coordinator/reports`):** Department performance analytics, grade distributions, CSV exporter, and ABET/NCEAC accreditation dossier compiler.
9. **Notices & Communication Center (`/coordinator/notifications`):** Official circular composer with target audience selectors (*All*, *Supervisors*, *Students*).
10. **Department Programme Administration (`/coordinator/profile`):** Policy parameters including max group size, faculty supervision quotas, and AI similarity cosine thresholds.

---

## 6. Environment Variables & Configuration

Configuration files are located in `fyp/.env` and `fyp/.env.example`:

```bash
# Frontend API endpoint
VITE_API_BASE_URL=http://127.0.0.1:8000/api

# Open-source embedding model identifier
VITE_AI_MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2

# Optional Cloud API keys (Leave blank for local open-source execution)
OPENAI_API_KEY=
HUGGINGFACE_API_KEY=
```

---

## 7. Step-by-Step Testing Guide (All 3 Portals)

Ensure both development servers are running:
* **Frontend:** In `fyp/`, run `npm run dev` (Available at `http://localhost:5173`)
* **Backend:** In `fyp/backend/`, run `python -m uvicorn main:app --reload` (Available at `http://127.0.0.1:8000`)

### Test Account 1: FYP Coordinator Portal
* **URL:** `http://localhost:5173/login`
* **Email:** `coordinator@university.edu`
* **Password:** `Password123!`
* **Expected Result:**
  * System detects role `coordinator` and navigates to **`/coordinator/overview`**.
  * Top navigation displays: **Overview**, **Proposals**, **Allocations**, **Similarity**, **Projects**, and **More** dropdown (*Students Registry*, *Deadlines & Calendar*, *Reports & Analytics*, *Department Memos*, *Department Settings*).
  * Avatar circle displays `CD` (*Prof. Dr. Tariq Mahmood*).

### Test Account 2: Supervisor Portal
* **URL:** `http://localhost:5173/login`
* **Email:** `supervisor@university.edu` *(or `imran.shah@university.edu`)*
* **Password:** `Password123!`
* **Expected Result:**
  * System detects role `supervisor` and navigates to **`/supervisor/overview`**.
  * Top navigation displays: **Overview**, **My Students**, **My Projects**, **Proposals**, **Documents**, and **More** dropdown (*Milestone Reviews*, *Evaluations & Marks*, *Feedback*, *Notifications*, *My Profile*).
  * Avatar circle displays `IS` (*Dr. Imran Shah*).

### Test Account 3: Student Portal
* **URL:** `http://localhost:5173/login`
* **Email:** `storyreal208@gmail.com` *(or create a new student account via `/signup`)*
* **Password:** `Password123!`
* **Expected Result:**
  * System detects role `student` and navigates to **`/student/dashboard`**.
  * Top navigation displays: **Dashboard**, **My Proposal**, **My Project**, **Milestones**, **Documents**, and **More** dropdown (*Feedback*, *Notifications*, *Profile*).

### Direct Route Demo Preview (No Login Required)
* Coordinator Control Center: `http://localhost:5173/coordinator/overview`
* Supervisor Overview: `http://localhost:5173/supervisor/overview`
* Student Dashboard: `http://localhost:5173/student/dashboard`

---

## 8. Codebase Structure & Reusability Design

```
FYPTrack/
├── fyp/
│   ├── .env.example             # Documented environment template
│   ├── .env                     # Local environment settings
│   ├── src/
│   │   ├── assets/              # Logos, stock illustrations, icons
│   │   ├── components/
│   │   │   ├── Auth/            # Reusable Auth forms & branding panel
│   │   │   ├── shared/          # Shared Badge, Card, StatCard, PageHeader, Navbar, Footer
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layouts/
│   │   │   ├── StudentLayout.jsx      # Student portal wrapper
│   │   │   ├── SupervisorLayout.jsx   # Supervisor portal wrapper
│   │   │   └── CoordinatorLayout.jsx  # Coordinator portal wrapper
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Public landing page
│   │   │   ├── student/         # 8 Student portal pages
│   │   │   ├── supervisor/      # 10 Supervisor portal pages
│   │   │   └── coordinator/     # 10 Coordinator portal pages
│   │   ├── services/
│   │   │   └── auth.js          # Authentication API calls & token storage
│   │   ├── App.jsx              # Central router configuration
│   │   └── index.css            # Tailwind theme tokens & design system rules
│   └── backend/
│       ├── database/            # SQLite engine & database connection
│       ├── models/              # User ORM model with role column
│       ├── routes/              # Auth routes (/api/auth/login, signup, me)
│       ├── services/            # JWT token creation & bcrypt hashing
│       ├── fyptrack.db          # SQLite database containing seeded users
│       └── main.py              # FastAPI application root
└── README.md
```

All portals share unified typography, CSS design tokens, badge styles, and card components without duplication, guaranteeing a seamless institutional experience.
