# FYPTrack - Final Year Project Management & Academic Audit System

FYPTrack is an enterprise-grade academic Final Year Project (FYP) management platform designed for higher education computing departments (Computer Science, Software Engineering, AI, and Information Technology). The platform interconnects all three primary institutional stakeholders - Students, Faculty Supervisors, and Department FYP Coordinators - into an automated, real-time workflow backed by a persistent relational database and an AI-powered similarity and originality verification engine.

---

## Table of Contents
1. System Overview and Institutional Purpose
2. Technology Architecture
3. Complete File-by-File Breakdown
4. The AI and Natural Language Processing Engine
5. Role-Based Access Control and Features
6. Real-World University Verification and Step-by-Step Testing Guide
7. Pre-Seeded Academic User Credentials
8. Complete REST API Reference
9. Installation and Local Deployment Guide
10. Architectural Best Practices and Production Notes

---

## 1. System Overview and Institutional Purpose

In academic universities, managing final year capstone projects through informal channels (such as emails, chat groups, paper binders, and disparate spreadsheets) introduces critical institutional risks:

- Project Redundancy: Students submit project proposals that duplicate past theses from prior graduation cohorts without coordinator awareness.
- Untracked Deliverables: Official Software Requirements Specifications (SRS), Architecture Documents, and Code archives get lost in supervisor email threads without version history.
- Unbalanced Faculty Workload: Popular supervisors become over-allocated beyond departmental policy while junior faculty members receive few or no supervisees.
- Lack of Grade Traceability: Disputes arise between students and examining committees regarding continuous assessment marks, deadline compliance, and feedback timeliness.
- Accreditation Deficits: ABET, HEC, and institutional accreditation teams require audited, rubric-backed artifacts and historical records for every capstone project.

FYPTrack provides an institutional single source of truth:
1. Every proposal, document submission, review endorsement, rubric score, and feedback note is permanently stored in the database.
2. Student deliverables are securely uploaded with versioning to the backend server and made available for supervisor inspection and download.
3. An AI Natural Language Processing engine cross-checks all submitted proposals against historical capstone archives to verify conceptual novelty.
4. Departmental settings enforce maximum group sizes, supervisor quota ceilings, and similarity thresholds in real-time.

---

## 2. Technology Architecture

### Backend Architecture
- Framework: FastAPI (Python 3.10+) asynchronous REST API with automatic OpenAPI documentation.
- Database: SQLite (`fyptrack.db`) with SQLAlchemy 2.0 ORM and typed declarative models.
- AI & NLP Vector Engine: Hugging Face Inference API (`sentence-transformers/all-MiniLM-L6-v2`) with local high-accuracy vectorized TF-IDF and n-gram cosine fallback.
- Security & Authentication: PBKDF2-SHA256 password hashing with Cryptographic JSON Web Tokens (JWT) via python-jose.
- File Pipeline: Python multipart stream handler storing deliverables on the server disk (`backend/uploads/`) with secure stream responses.

### Frontend Architecture
- Core: React 19 with Vite bundler for instant Hot Module Replacement.
- Client Routing: React Router v7 with protected routes and role-based layout wrappers.
- Styling: Custom CSS Design System with Tailwind CSS utilities, institutional typography (Bricolage Grotesque and Plus Jakarta Sans), and brand color palette (`#17302A`, `#EBB44B`, `#0B5A3E`).
- State and Feedback: Centralized REST API client with dual-host auto-fallback (`localhost:8000` and `127.0.0.1:8000`), persistent JWT storage, and custom non-intrusive floating toasts.
- Visualizations: Interactive SVG charts (Cohort progress charts, distribution bars, workload meters).

---

## 3. Complete File-by-File Breakdown

This section details every file in the project, its architectural responsibility, and how it interacts with other system components.

### 3.1 Root Level Files
- `README.md`: Master end-to-end documentation, architecture guide, AI specifications, and test manual.
- `REAL_WORLD_VERIFICATION.md`: Step-by-step verification protocols and test cases for university deployment.

### 3.2 Backend Implementation (`fyp/backend/`)

#### Core Configuration and Database Lifecycle
- `backend/main.py`: Main entrypoint for the FastAPI application. Sets up CORS middleware, static file mounting for uploaded deliverables, database table creation on startup, initial seed invocation, and API router registration.
- `backend/core/config.py`: Environment configuration loader for JWT secret keys, token expiration windows, upload directories, and API prefix paths.
- `backend/core/security.py`: Password hashing utilities (PBKDF2/Bcrypt) and JWT token encoder/decoder functions.
- `backend/database/session.py`: SQLAlchemy engine initialization, `SessionLocal` generator, and `get_db` dependency injection provider for FastAPI endpoints.

#### Data Models (`backend/models/`)
- `models/user.py`: `User` model representing academic participants. Attributes: `id`, `full_name`, `email`, `hashed_password`, `role` (`student`, `supervisor`, `coordinator`), `department`, and `created_at`.
- `models/project.py`: `Project` model representing an FYP group capstone. Attributes: `id`, `title`, `abstract`, `domain`, `tech_stack`, `group_members` (JSON array of student member names), `student_id` (foreign key to `User`), `supervisor_id` (foreign key to `User`), `supervisor_status` (`Pending`, `Endorsed`, `Revision`), `coordinator_status` (`Submitted`, `Under Review`, `Approved`, `Changes Requested`), and `current_stage`.
- `models/document.py`: `Document` model tracking uploaded project deliverables (SRS, Design Spec, Code Zip, Thesis). Attributes: `id`, `project_id`, `file_name`, `file_path`, `file_size`, `doc_type`, `version`, `status` (`Pending`, `Approved`, `Changes Requested`), and `supervisor_comment`.
- `models/milestone.py`: `Milestone` model tracking the 5 formal academic phases (Proposal, SRS, Mid-Term, Final Defense, Documentation). Attributes: `id`, `title`, `description`, `due_date`, `weight_percent`, and `status`.
- `models/evaluation.py`: `Evaluation` model storing continuous assessment rubric grades. Attributes: `id`, `project_id`, `supervisor_id`, `phase`, `scores` (JSON breakdown across criteria), `total_score`, and `remarks`.
- `models/feedback.py`: `Feedback` model representing threaded communication between student groups and supervisors. Attributes: `id`, `project_id`, `sender_id`, `sender_name`, `sender_role`, `message`, and `timestamp`.
- `models/notification.py`: `Notification` model storing system alerts. Attributes: `id`, `user_id`, `title`, `message`, `is_read`, and `created_at`.
- `models/setting.py`: `Setting` model storing department-wide rules. Attributes: `id`, `max_group_size`, `max_supervisor_quota`, `similarity_threshold_pct`, `submission_deadline`, and `department_name`.

#### API Route Controllers (`backend/routes/`)
- `routes/router.py`: Central router consolidating all route modules under the `/api` prefix.
- `routes/auth.py`: Endpoints for student and supervisor registration (`/signup`), credential verification (`/login`), profile retrieval (`/me`), and password reset workflows.
- `routes/projects.py`: Proposal submission, project updates, supervisor endorsement, coordinator ratification, and dynamic group member retrieval.
- `routes/documents.py`: Multipart file upload handler, secure file download streamer, and supervisor document verification with review remarks.
- `routes/similarity.py`: Retrieval of automated similarity audits for all student proposals and access to the historical capstone benchmark archive.
- `routes/supervisors.py`: Listing of active faculty supervisors with their current workload, capacity limits, and research domains.
- `routes/students.py`: Departmental student directory and group registration status.
- `routes/milestones.py`: Milestone stage retrieval and coordinator deadline update endpoints.
- `routes/evaluations.py`: Rubric marks submission and project evaluation history queries.
- `routes/feedback.py`: Retrieval and posting of threaded discussion messages.
- `routes/notifications.py`: Polling endpoint for unread notifications and mark-as-read actions.
- `routes/settings.py`: Departmental policy inspection and update endpoints.
- `routes/health.py`: Server health check endpoint.

#### Services and Business Logic (`backend/services/`)
- `services/similarity_service.py`: The AI and NLP Similarity Engine. Integrates Hugging Face Inference API with local vectorized n-gram and cosine distance fallback. Evaluates submitted student proposals against the institutional repository of historical theses (2021-2025).
- `services/seed_service.py`: Automated database seeder. Populates the database with initial student accounts, faculty supervisors, coordinator profiles, active projects, and historical thesis benchmarks.
- `services/auth_service.py`: Authentication business logic and token claim generation.

---

### 3.3 Frontend Implementation (`fyp/src/`)

#### Application Entry and Navigation
- `src/main.jsx`: React application entrypoint mounting the application with toast context.
- `src/App.jsx`: Central router defining all public and protected routes for Student, Supervisor, and Coordinator roles.
- `src/index.css`: Global design tokens, typography imports, button presets, and table utilities.
- `src/services/api.js`: Unified API client providing async methods for all backend endpoints with automatic fallback between `http://localhost:8000` and `http://127.0.0.1:8000`.
- `src/services/auth.js`: JWT storage and role decoding helpers.

#### Layout Frames (`src/layouts/`)
- `layouts/StudentLayout.jsx`: Responsive layout container with student top navigation, active route styling, dynamic notification counter, and user profile chip.
- `layouts/SupervisorLayout.jsx`: Faculty portal frame with supervision navigation links, workload indicators, and notifications bell.
- `layouts/CoordinatorLayout.jsx`: Administrative dashboard frame with institutional navigation links and governance tools.

#### Shared Components (`src/components/shared/`)
- `components/shared/Navbar.jsx`: Public and institutional header component with navigation links and role redirects.
- `components/shared/Footer.jsx`: Institutional footer with departmental links and academic copyright information.
- `components/shared/Card.jsx`: Standardized glassmorphic card container.
- `components/shared/Badge.jsx`: Color-coded status badge (`green`, `amber`, `red`, `gray`).
- `components/shared/StatCard.jsx`: Metric display card for numbers, growth indicators, and subtitles.
- `components/shared/PageHeader.jsx`: Unified page title and breadcrumb action bar.
- `components/shared/Toast.jsx`: Animated floating notification alert provider and hook (`useToast`).

#### Student Portal Pages (`src/pages/student/`)
- `student/Dashboard.jsx`: Central student overview. Displays submission status, assigned supervisor card, dynamic group members card (showing real names and the `You` pill), milestone progress, and recent activity.
- `student/Proposal.jsx`: Formal proposal submission form. Allows inputting project title, technical domain, dynamic group member names, tech stack, and abstract.
- `student/Project.jsx`: Detailed project overview showing approved scope, GitHub repository link, assigned supervisor profile, and teammate roster.
- `student/Milestones.jsx`: Interactive timeline tracking the 5 formal academic stages from Proposal Defense to Final Viva.
- `student/Documents.jsx`: Deliverables management screen. Allows selecting document category (SRS, Design Spec, Code Zip), choosing files from disk, uploading to server, and reviewing supervisor comments.
- `student/Feedback.jsx`: Threaded project chat with the assigned supervisor for milestone discussions.
- `student/Notifications.jsx`: Feed of institutional notifications for supervisor allocation, proposal decisions, and document reviews.
- `student/Profile.jsx`: Student academic credentials, registration number, and contact details.

#### Supervisor Portal Pages (`src/pages/supervisor/`)
- `supervisor/Overview.jsx`: Faculty dashboard displaying total assigned groups, pending document reviews, cohort progress, and urgent alerts.
- `supervisor/Students.jsx`: Student roster under supervision with search, status filters, and milestone progress bars.
- `supervisor/Projects.jsx`: Grid of supervised projects displaying technical stacks, current stages, and quick inspection links.
- `supervisor/Proposals.jsx`: Academic proposal review interface. Allows inspecting student abstracts and recording endorsements or revision requests.
- `supervisor/Documents.jsx`: Deliverables grading interface. Lists all files uploaded by student groups, provides direct download links, and enables recording approval or correction requests with notes.
- `supervisor/Milestones.jsx`: Sign-off screen for certifying student milestone completions.
- `supervisor/Evaluations.jsx`: Official rubric grading interface. Evaluates projects across 4 standard criteria (Problem Formulation, Methodology, Implementation, Presentation) out of 30 marks total.
- `supervisor/Feedback.jsx`: Faculty messaging portal to respond to student queries and issue instructions.
- `supervisor/Notifications.jsx`: Alert stream notifying faculty when students submit new deliverables or proposals.
- `supervisor/Profile.jsx`: Faculty profile showing research domains, office location, and supervision quota usage (e.g. 4/5 groups).

#### Coordinator Portal Pages (`src/pages/coordinator/`)
- `coordinator/Overview.jsx`: Departmental command center. Visualizes the complete project pipeline, stage distribution, faculty workload meters, and pending approvals.
- `coordinator/Proposals.jsx`: Central proposal ratification board. Enables the FYP committee to review abstracts, inspect supervisor endorsements, and issue binding decisions (`Approved`, `Changes Requested`).
- `coordinator/SupervisorAllocation.jsx`: Workload balancer. Displays student proposals awaiting supervisor allocation and pairs them with eligible faculty based on capacity limits and research domain alignment.
- `coordinator/SimilarityChecker.jsx`: The Clean AI Similarity and Plagiarism Audits page. Automatically loads all student proposals with computed overlap percentages, risk flags, and an interactive side-by-side semantic diff inspector comparing student text with historical thesis records.
- `coordinator/Projects.jsx`: Master project registry with full-text search across titles, groups, domains, and supervisors.
- `coordinator/Students.jsx`: Master student directory verifying credit hours and defense eligibility.
- `coordinator/Milestones.jsx`: Central calendar manager for setting official department deadlines and broadcasting notifications.
- `coordinator/AnalyticsReports.jsx`: Department metrics and accreditation report center. Generates summary metrics and exports official Accreditation PDFs.
- `coordinator/Notifications.jsx`: Department circular and memo broadcasting center.
- `coordinator/Profile.jsx`: Department policy settings. Allows configuring maximum group sizes, supervisor quota limits, and similarity threshold percentages.

---

## 4. The AI and Natural Language Processing Engine

The AI subsystem is located in `fyp/backend/services/similarity_service.py` and exposed via `backend/routes/similarity.py`. It solves the problem of thesis duplication and conceptual overlap in final year projects.

### How the Engine Works
1. Student Proposal Ingestion:
   When a student submits or updates a proposal in `/student/proposal`, the backend automatically extracts the combined semantic text:
   `combined_text = f"{title} {domain} {abstract}"`

2. Hugging Face Inference API Integration:
   - Configured Model: `sentence-transformers/all-MiniLM-L6-v2`
   - Endpoint: `https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2`
   - If an API key is provided via the `HUGGINGFACE_API_KEY` or `HF_TOKEN` environment variable, the engine sends the student text and archive candidate texts to Hugging Face to obtain semantic sentence embeddings and cosine distances.

3. High-Accuracy Local Fallback:
   If no Hugging Face API key is present or if network requests time out, the system automatically runs the built-in vectorized engine:
   - Tokenization: Words are extracted, converted to lower-case, and pruned using an academic stopword elimination list (`backend/services/similarity_service.py:STOPWORDS`).
   - Feature Extraction: Both unigrams and bigrams (2-grams) are extracted to capture phrase-level and contextual concepts (e.g., "mandi pricing", "smart contracts", "federated learning").
   - Cosine Similarity: Dot products between feature frequency vectors and magnitude norms are computed against each record in the historical archive pool.

4. Institutional Historical Thesis Repository (25+ Indexed Capstones):
   The backend indexes past capstone dissertations spanning 2020 to 2025 across all major computing domains:
   - Machine Learning: Wheat Yield Forecasting and Mandi Analytics (ARCH-2023-014), Algorithmic Trading with Reinforcement Learning (ARCH-2024-033)
   - Cybersecurity & Blockchain: Academic Credential Notarization (ARCH-2024-044), ZK-Rollup Micro-Payments (ARCH-2022-055), Smart Contract Vulnerability Scanner (ARCH-2024-081), Cold-Chain Provenance (ARCH-2024-098), ZK-Voting (ARCH-2024-121)
   - Computer Vision: Fabric Defect Detection (ARCH-2022-072), Real-Time Traffic Congestion Timing (ARCH-2023-112), Drone Multispectral Crop Disease Diagnosis (ARCH-2024-067), Safety Gear Compliance (ARCH-2021-018), Diabetic Retinopathy Grading (ARCH-2024-052), AR Surgical Tumor Projection (ARCH-2023-104)
   - Robotics & Embedded: Warehouse AGV Navigation (ARCH-2023-088), Agricultural Spraying Drone (ARCH-2023-049), EEG Brain-Computer Interface (ARCH-2023-125), Search & Rescue Swarm Robotics (ARCH-2023-062)
   - Healthcare AI: Privacy-Preserving Federated Learning for Multi-Hospital EHR (ARCH-2024-102)
   - Distributed Systems & Cloud: Solar Microgrid Load Forecasting (ARCH-2023-031), Cloud-Native Microservices Telemetry (ARCH-2022-094), Serverless Video Transcoding (ARCH-2023-077), Smart Campus HVAC Optimization (ARCH-2021-089)
   - Natural Language Processing: Low-Resource Urdu Dialect Speech Transcriber (ARCH-2024-019), Legal Contract Clause Analysis with BERT (ARCH-2022-041)
   - Software Engineering: Automated Code Review with Graph Neural Networks (ARCH-2022-064)

5. AI Supervisor Recommendation & Workload Matching Engine:
   Located in `backend/services/similarity_service.py` (`recommend_supervisors_for_project`), this subsystem calculates an AI Match Score (0 - 100%) for each faculty member when a student group submits an FYP proposal:
   - Domain Alignment (45% weight): Compares proposal domain against the supervisor's primary research expertise.
   - Research Keyword Intersection (35% weight): Matches proposal tokens and bigrams against faculty publication and domain keywords.
   - Workload Quota Balancing (20% weight): Incorporates live supervision slots (e.g. 5 max) to prevent over-allocation.
   - Ranks supervisors with recommendation badges (`Top AI Recommendation`, `Strong Academic Fit`) and transparent justification reasons for coordinators.

6. Calibrated Similarity Thresholds:
   - Similarity < 10%: Low Risk (High Novelty). Green badge. Automatically cleared for supervisor review.
   - 10% <= Similarity < 20%: Moderate Overlap. Amber badge. Literature review must distinguish methodology.
   - Similarity >= 20%: High Risk Overlap. Red badge. Triggers an automatic high-overlap alert and requires coordinator originality clearance before supervisor assignment.

---

## 5. Role-Based Access Control and Features

| Capability | Student | Supervisor | Coordinator |
| :--- | :---: | :---: | :---: |
| Submit and edit project proposal | Yes | No | No |
| Add and view dynamic group members | Yes | View Only | View Only |
| Upload deliverable files (SRS, Code, Thesis) | Yes | No | No |
| Download uploaded student deliverables | Yes | Yes | Yes |
| Endorse or request revision on proposals | No | Yes | No |
| Final binding proposal ratification | No | No | Yes |
| Assign faculty supervisors to projects | No | No | Yes |
| Enter official continuous assessment marks | No | Yes | View Only |
| View automatic AI similarity & plagiarism audits | No | No | Yes |
| Update departmental milestone deadlines | No | No | Yes |
| Export departmental accreditation PDF | No | No | Yes |
| Configure department rules and quotas | No | No | Yes |

---

## 6. Real-World University Verification and Step-by-Step Testing Guide

This guide allows any university faculty member, coordinator, or student to test all connected capabilities across the system.

### Step 1: Student Proposal Submission
1. Navigate to `http://localhost:5173/login`.
2. Sign in with the student account:
   - Email: `student@university.edu`
   - Password: `student123`
3. Click on **My Proposal** in the top navigation.
4. Enter the proposal details:
   - Title: *Autonomous Agricultural Drone for Mandi Yield Surveillance*
   - Domain: *Machine Learning & AI*
   - Group Members: Enter real teammate names e.g., `Ali Khan (FA21-BCS-010), Usman Tariq (FA21-BCS-045)`
   - Tech Stack: `Python, PyTorch, React, FastAPI`
   - Abstract: Enter a detailed problem description.
5. Click **Submit Proposal**.
6. Navigate to **Dashboard**:
   - Verification: Card 2 (Group Members) displays strictly the names you entered alongside your logged-in student account labeled with the `You` pill. Hardcoded static demo members are eliminated.

### Step 2: Coordinator AI Similarity and Novelty Audit
1. Open a new Incognito browser window and navigate to `http://localhost:5173/login`.
2. Sign in with the coordinator account:
   - Email: `coordinator@university.edu`
   - Password: `coord123`
3. Click **Similarity** in the navigation bar.
4. Verification:
   - All submitted proposals automatically appear in the left-hand audit list with their calculated overlap percentages and status.
   - Clicking on any proposal loads the side-by-side semantic inspector on the right, showing the current student abstract, the closest historical archive thesis, and significant matching terms.
   - No manual pasting or weird tab switching is required.
   - Click **Approve as Legitimate Novelty** or **Require Topic Revision**.

### Step 3: Proposal Ratification and Supervisor Allocation
1. In the Coordinator portal, click **Proposals**.
2. Select the submitted proposal and click **Approve Proposal**.
3. Click **Allocations** in the top navigation.
4. Find the student group in the unallocated queue.
5. Select **Dr. Imran Shah** from the supervisor dropdown and click **Allocate Supervisor**.

### Step 4: Real-Time Notification Verification
1. Return to the Student portal window (logged in as `student@university.edu`).
2. Without manually refreshing the page, watch the bell icon in the top navigation.
3. Verification: Within 8 seconds, the notification counter updates via periodic background polling.
4. Click the bell icon:
   - Alert: *"Dr. Imran Shah has been assigned as your project supervisor."*
   - Alert: *"Coordinator Decision Announced: Project proposal Approved."*

### Step 5: Deliverable Upload and Supervisor Grading
1. In the Student portal, go to **Documents**.
2. Select Category `Software Requirements Specification (SRS)`, Version `v1.0`, and select a PDF or DOCX file from your computer.
3. Click **Upload Deliverable**. The file uploads to the server disk.
4. In another window, log in as supervisor (`supervisor@university.edu` / `super123`).
5. Navigate to **Document Reviews**:
   - The student document appears with a direct **Download File** link.
   - Click **Review Deliverable**, enter remarks, and approve.
6. Navigate to **Evaluations & Marks**:
   - Select the student group and enter marks across the 4 criteria (out of 30 marks total).
   - Click **Save & Finalize Evaluation**.
7. Return to the Student portal: The notification alerts the student that the milestone has been graded.

---

## 7. Pre-Seeded Academic User Credentials

All three institutional roles are pre-seeded in the database:

| Institutional Role | Full Name | Email Address | Password | Academic Scope / Department |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | Hamza Tariq | `student@university.edu` | `student123` | BS Software Engineering (Group 14 Lead) |
| **Student (Alt)** | Mudassar Gill | `storyreal208@gmail.com` | `Password123!` | BS Computer Science |
| **Supervisor** | Dr. Imran Shah | `supervisor@university.edu` | `super123` | Associate Professor, Machine Learning & AI |
| **Supervisor** | Dr. Sadia Malik | `sadia.malik@university.edu` | `super123` | Assistant Professor, Cybersecurity |
| **Coordinator** | Prof. Dr. Tariq Mahmood | `coordinator@university.edu` | `coord123` | Head of FYP Committee / Administration |

Anyone can also register a new account via `/signup` by selecting either Student or Supervisor.

---

## 8. Complete REST API Reference

The interactive Swagger documentation is available at `http://localhost:8000/docs`.

### Authentication Endpoints (`/api/auth`)
- `POST /api/auth/login`: Authenticate credentials; returns JWT token and user info.
- `POST /api/auth/signup`: User registration with role designation.
- `GET /api/auth/me`: Retrieve current authenticated profile from token claims.

### Project Endpoints (`/api/projects`)
- `GET /api/projects/my`: Fetch project associated with current logged-in user.
- `GET /api/projects/all`: Fetch all departmental projects (Coordinator scope).
- `POST /api/projects/`: Submit new FYP project proposal.
- `POST /api/projects/{id}/assign-supervisor`: Assign faculty supervisor to project.
- `POST /api/projects/{id}/supervisor-decision`: Record supervisor endorsement or revision request.
- `POST /api/projects/{id}/coordinator-decision`: Record binding coordinator approval or revision request.

### Document Endpoints (`/api/documents`)
- `POST /api/documents/upload`: Multipart file upload storing file on server disk.
- `GET /api/documents/review-list`: Fetch all uploaded documents for supervisor inspection.
- `GET /api/documents/project/{project_id}`: Fetch all documents for a project.
- `GET /api/documents/download/{id}`: Stream file download from server disk.
- `POST /api/documents/{id}/review`: Record supervisor verification decision and feedback.

### Similarity and AI Endpoints (`/api/similarity`)
- `GET /api/similarity/audits`: Run comprehensive institutional similarity audit on all active proposals against archive pool.
- `POST /api/similarity/check`: Run real-time NLP similarity check on arbitrary text.
- `GET /api/similarity/benchmarks`: Fetch list of indexed historical capstone archives.

### Milestone and Evaluation Endpoints (`/api/milestones`, `/api/evaluations`)
- `GET /api/milestones/`: List academic milestones and submission deadlines.
- `PUT /api/milestones/{id}`: Update milestone deadline (Coordinator only).
- `GET /api/evaluations/project/{project_id}`: Fetch evaluation scores for a project.
- `POST /api/evaluations/`: Save continuous assessment rubric marks.

### Settings Endpoints (`/api/settings`)
- `GET /api/settings/`: Get current departmental policy settings.
- `PUT /api/settings/`: Update supervisor quotas, group limits, and similarity thresholds.

---

## 9. Installation and Local Deployment Guide

### Prerequisites
- Python 3.10 or higher
- Node.js 18.0.0 or higher
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/MudassarGill/FYPTrack.git
cd FYPTrack
```

### Step 2: Backend Setup
```bash
cd fyp/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic python-jose passlib bcrypt python-multipart requests

# Optional: Set Hugging Face API key
# set HUGGINGFACE_API_KEY=your_hf_token_here

# Start backend server
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
Backend API will be running at `http://127.0.0.1:8000`.
Interactive Swagger Docs: `http://127.0.0.1:8000/docs`.

### Step 3: Frontend Setup
Open a new terminal window:
```bash
cd fyp

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend client will be running at `http://localhost:5173`.

---

## 10. Architectural Best Practices and Production Notes

- Dual-Host Network Fallback: The frontend REST client automatically falls back between `localhost:8000` and `127.0.0.1:8000` to prevent Windows loopback firewall blocks.
- Clean Database Reset: To reset the database to fresh factory seed state at any time, stop the backend server, delete `fyp/backend/fyptrack.db`, and restart the backend server. The database and seed records will be recreated automatically.
- Deliverable Integrity: Files are stored in `fyp/backend/uploads/` with sanitized timestamp prefixes to prevent file collision and directory traversal vulnerabilities.
- No Hardcoded Data: All dashboards, group members, supervisor allocations, similarity audits, and notifications operate directly against the database and REST endpoints.
