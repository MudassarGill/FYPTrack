# FYPTrack - Real-World University Verification & End-to-End Testing Manual

This master verification guide provides exhaustive, step-by-step instructions for testing and validating **FYPTrack** in an authentic higher education university environment. It follows a single real capstone group through the complete institutional lifecycle across the **Student Portal**, **Supervisor Portal**, and **Coordinator Portal**, detailing exact inputs, expected visual results, and database state transitions for every dashboard.

---

## Table of Contents
1. Verified Academic User Accounts
2. Server Launch and Port Verification
3. Real-World Capstone Project Test Case Specification
4. Step-by-Step Portal Walkthroughs & Expected Results
   - Phase 1: Student Portal - Proposal Drafting and Dynamic Teammates
   - Phase 2: Student Dashboard - Verification of Real Group Members
   - Phase 3: Coordinator Portal - Automated AI Similarity & Plagiarism Audit
   - Phase 4: Coordinator Portal - AI Supervisor Recommendation & Quota Allocation
   - Phase 5: Coordinator Portal - Formal Committee Proposal Ratification
   - Phase 6: Student Portal - Live Background Notification Verification
   - Phase 7: Student Portal - Official Deliverable Upload to Server Storage
   - Phase 8: Supervisor Portal - Document Inspection, Download, and Review
   - Phase 8B: Supervisor Portal - Milestone Progress Certification & Inspection Log
   - Phase 9: Supervisor Portal - Continuous Assessment Rubric Evaluation (30 Marks)
   - Phase 10: Feedback & Discussion Channel Verification
   - Phase 11: Coordinator Portal - Academic Calendar & Milestone Management
   - Phase 12: Coordinator Portal - Accreditation Metric Audits & PDF Generation
5. Edge Cases & High-Similarity Plagiarism Test Case
6. System Verification Matrix

---

## 1. Verified Academic User Accounts

All three academic roles are pre-seeded in the database with verified credentials:

| Institutional Role | Name | Email Address | Password | Departmental Scope / Title |
| :--- | :--- | :--- | :--- | :--- |
| **Student (Lead)** | Hamza Tariq | `student@university.edu` | `student123` | BS Software Engineering (Group 14 Lead) |
| **Supervisor** | Dr. Imran Shah | `supervisor@university.edu` | `super123` | Associate Professor (Machine Learning & AI) |
| **Supervisor** | Dr. Sadia Malik | `sadia.malik@university.edu` | `super123` | Assistant Professor (Cybersecurity & Blockchain) |
| **Coordinator** | Prof. Dr. Tariq Mahmood | `coordinator@university.edu` | `coord123` | Head of Department / FYP Committee Chair |

> **Note on Self-Registration:** Students and faculty members can also create brand-new accounts via `http://localhost:5173/signup` by choosing either **Student** or **Supervisor** as their designated institutional role.

---

## 2. Server Launch and Port Verification

Ensure both system layers are active concurrently in separate terminal consoles:

1. **Backend Server (FastAPI + SQLite + NLP Engine):**
   - Path: `fyp/backend`
   - Command: `python -m uvicorn main:app --reload --port 8000`
   - Verification URL: Open `http://localhost:8000/docs` in your browser. The interactive OpenAPI Swagger UI must load.
   - Database File: `fyp/backend/fyptrack.db`

2. **Frontend Client (React 19 + Vite):**
   - Path: `fyp`
   - Command: `npm run dev`
   - Verification URL: Open `http://localhost:5173/` in your browser. The university landing page must load.

---

## 3. Real-World Capstone Project Test Case Specification

For this complete testing walkthrough, we use an authentic Computer Science capstone project:

- **Group Designation**: Group 14
- **Lead Student**: Hamza Tariq (`student@university.edu`, FA20-BSE-042)
- **Teammates**: Ayesha Noor (FA20-BSE-019), Zainab Ali (FA20-BSE-058)
- **Project Title**: *Deep Learning for Mandi Agricultural Pricing and Yield Prediction*
- **Technical Domain**: *Machine Learning*
- **Technology Stack**: *Python, PyTorch, FastAPI, React, PostgreSQL, Scikit-Learn*
- **Project Abstract**:
  > Forecasting wholesale mandi pricing using multi-season arrival volume and meteorological indices via bidirectional LSTM networks and ARIMA baseline algorithms. Predicting regional crop output using seasonal rainfall, satellite NDVI vegetative indices, and district mandi supply logs to optimize supply chain distribution.

---

## 4. Step-by-Step Portal Walkthroughs & Expected Results

---

### Phase 1: Student Portal - Proposal Drafting and Dynamic Teammates

#### Actions
1. Open a clean browser window at `http://localhost:5173/login`.
2. Enter the Student credentials:
   - Email: `student@university.edu`
   - Password: `student123`
3. Click **Sign in**.
4. In the top navigation bar, click **My Proposal** (`/student/proposal`).
5. Complete the proposal form with the following values:
   - **Project Title**: `Deep Learning for Mandi Agricultural Pricing and Yield Prediction`
   - **Academic Domain**: Select or type `Machine Learning`
   - **Group Members**: Type `Ayesha Noor (FA20-BSE-019), Zainab Ali (FA20-BSE-058)`
   - **Technology Stack**: `Python, PyTorch, FastAPI, React, PostgreSQL`
   - **Abstract / Problem Statement**: Paste the abstract from Section 3.
6. Click **Submit Proposal**.

#### Expected Visual Results on Screen
- A green floating toast alert appears: *"Project proposal submitted successfully for supervisor and coordinator review."*
- The proposal status badge updates from unsubmitted to `Submitted`.

#### Expected Database State
- A new or updated row in the `projects` table with `student_id` pointing to Hamza Tariq, `title`, `domain`, `abstract`, and `group_members` JSON array containing `["Ayesha Noor (FA20-BSE-019)", "Zainab Ali (FA20-BSE-058)"]`.
- The AI similarity scan is automatically triggered in the background against the institutional thesis archive pool.

---

### Phase 2: Student Dashboard - Verification of Real Group Members

#### Actions
1. From the top navigation bar, click **Dashboard** (`/student/dashboard`).

#### Expected Visual Results on Screen
- **Card 1 (Project Overview)**: Displays the submitted title, `Machine Learning` domain badge, and `Submitted` status pill.
- **Card 2 (Group Members)**:
  - Renders **strictly** the real group members entered in Phase 1:
    - `Hamza Tariq` (labeled with a dark `You` pill)
    - `Ayesha Noor`
    - `Zainab Ali`
  - Hardcoded demo students are completely eliminated.
  - The card footer displays: `Group 14 - 3 members`.
- **Card 3 (Milestone Timeline)**: Stage 1 (Proposal Submission) is marked active.

---

### Phase 3: Coordinator Portal - Automated AI Similarity & Plagiarism Audit

#### Actions
1. Open an Incognito window or second browser at `http://localhost:5173/login`.
2. Sign in with the Coordinator credentials:
   - Email: `coordinator@university.edu`
   - Password: `coord123`
3. Click **Similarity** in the navigation bar (`/coordinator/similarity`).

#### Expected Visual Results on Screen
- **Clean Audit Screen**: The messy technical jargon banner and weird tab buttons have been eliminated.
- **Left Column (Submitted Proposals)**:
  - All active departmental proposals appear automatically.
  - `Group 14` (*Deep Learning for Mandi Agricultural Pricing...*) appears with an overlap score badge (e.g. `48% Overlap - High Risk` or `Cleared`).
  - Status indicator reads: `Review Required` or `Cleared by Committee`.
- **Right Column (Semantic Diff Inspector)**:
  - Clicking on Group 14 displays the side-by-side comparison:
    - **Left Box (Current 2026 Proposal)**: Group 14 abstract, lead author Hamza Tariq.
    - **Right Box (Historical Archive Match)**: Matched historical thesis `ARCH-2023-014: Wheat Yield Forecasting and Mandi Analytics (2023)` supervised by Dr. Imran Shah.
    - **Significant Semantic Terms**: Highlights overlapping concepts: `mandi`, `pricing`, `forecasting`, `lstm`, `crop`.
- Click the green button: **Approve as Legitimate Novelty**.
- Expected Result: Toast alert confirms: *"Originality check cleared and approved by Coordinator."* Status badge updates to green `Cleared by Committee`.

---

### Phase 4: Coordinator Portal - AI Supervisor Recommendation & Quota Allocation

#### Actions
1. In the Coordinator portal, click **Allocations** in the top navigation bar (`/coordinator/supervisors`).

#### Expected Visual Results on Screen
- **Unassigned Proposals Section**:
  - Displays Group 14 (*Deep Learning for Mandi Agricultural Pricing and Yield Prediction*).
  - **AI Recommendation Box**:
    - Top recommendation: **Dr. Imran Shah** (Associate Professor).
    - AI Match Score: Displays `96.4% Match - Top AI Recommendation`.
    - Rationale tags: Displays `Domain alignment in Machine Learning`, `Specialized in neural, lstm, forecasting`, `High Availability (3 slots)`.
  - **Supervisor Dropdown**: Supervisors are ranked in descending order of AI match score.
  - Faculty quota limits are enforced (max 5 groups per faculty).
2. Click **Allocate Dr. Imran Shah (96.4% Match)**.
3. Expected Result:
   - Green toast alert: *"Group 14 allocated to Dr. Imran Shah successfully!"*
   - Group 14 moves out of the unassigned queue.
   - Dr. Imran Shah's workload counter increments by 1 group in the bottom faculty capacity grid.

---

### Phase 5: Coordinator Portal - Formal Committee Proposal Ratification

#### Actions
1. In the Coordinator portal, click **Proposals** (`/coordinator/proposals`).
2. Locate Group 14 under the **Pending Decision** filter.
3. Notice that the allocated supervisor is now displayed as `Dr. Imran Shah`.
4. Enter formal committee remarks: `Approved by Department FYP Committee. Proceed with SRS formulation under Dr. Imran Shah.`
5. Click **Approve Proposal**.

#### Expected Visual Results on Screen
- Floating toast confirms approval.
- Proposal status updates to `Approved` in the database.
- An institutional approval notification is dispatched to all Group 14 members.

---

### Phase 6: Student Portal - Live Background Notification Verification

#### Actions
1. Return to Browser 1 (logged in as Student `student@university.edu`).
2. Do **NOT** refresh the page manually. Watch the bell icon in the top navigation bar.

#### Expected Visual Results on Screen
- Within **8 seconds**, the notification badge counter on the bell icon automatically increments from `0` to `2` (via the periodic polling engine).
- Click on the bell icon:
  - Notification 1: *"Dr. Imran Shah has been assigned as your project supervisor."*
  - Notification 2: *"Coordinator Decision Announced: Project proposal Approved."*
- Click **Mark all as read**: Badge counter resets to zero cleanly.

---

### Phase 7: Student Portal - Official Deliverable Upload to Server Storage

#### Actions
1. In the Student portal, navigate to **Documents** (`/student/documents`).
2. Fill out the deliverable upload card:
   - **Document Type**: Select `Software Requirements Specification (SRS)`
   - **Document Version**: Select `v1.0`
   - **File Selection**: Choose any PDF or Word file from your computer (e.g. `Group14_SRS_v1.0.pdf`).
3. Click **Upload Deliverable**.

#### Expected Visual Results on Screen
- Floating toast confirms: *"Deliverable uploaded successfully to departmental repository."*
- The document appears in the **Submitted Project Deliverables** table with:
  - Document Title: `Software Requirements Specification (SRS)`
  - Version: `v1.0`
  - Upload Timestamp: Current date and time
  - Status Badge: Amber `Pending Supervisor Review`
  - Download Button: Clickable link to download the file directly from the backend server.

#### Expected Database & Disk State
- The physical file is saved on the server disk under `fyp/backend/uploads/` with a unique timestamp prefix.
- A row is inserted into the `documents` table referencing `project_id`, `file_path`, and `status = 'Pending'`.

---

### Phase 8: Supervisor Portal - Document Inspection, Download, and Review

#### Actions
1. Open a new browser window or tab at `http://localhost:5173/login`.
2. Sign in with Supervisor credentials:
   - Email: `supervisor@university.edu`
   - Password: `super123`
3. Click **Document Reviews** (`/supervisor/documents`).

#### Expected Visual Results on Screen
- The uploaded `Software Requirements Specification (SRS) v1.0` for Group 14 appears in the review queue.
- Click **Download Deliverable**:
  - The browser initiates a direct binary download from `http://localhost:8000/api/documents/download/{id}`.
  - The downloaded file matches the exact bytes uploaded by the student.
4. Click **Review Deliverable**:
   - A modal or review box opens.
   - Enter supervisor feedback: `SRS functional requirements, use-case diagrams, and LSTM architecture specifications approved for mid-term defense.`
   - Click **Approve Deliverable**.
5. Expected Result:
   - Toast confirms deliverable approval.
   - Status badge updates to green `Approved`.
   - A notification is transmitted to the student group.

---

### Phase 8B: Supervisor Portal - Milestone Progress Certification & Inspection Log

#### Actions
1. In the Supervisor portal, navigate to **Milestone Reviews** (`/supervisor/milestones`).
2. Locate **Group 14** (*Deep Learning for Mandi Agricultural Pricing and Yield Prediction*).
3. Under **System Design Document & Architecture**, observe:
   - Status: `In Progress`
   - Milestone Progress: `70%`
   - Deliverable: `Draft v1 uploaded for review`
4. Click **Inspection Log**:
   - Modal displays the audit checklist, deliverable artifact reference, and originality verification (`96.4% Unique`).
   - Click **Close Log**.
5. Click **Mark Completed**:
   - Progress bar dynamically animates from `70%` to `100%`.
   - Status badge transitions from amber `In Progress` to green `Completed`.
   - Action updates from button to a verified `Certified Completed` badge.
   - Deliverable notes update to `Certified and approved by supervisor`.
   - Floating toast confirms certification.

---

### Phase 9: Supervisor Portal - Continuous Assessment Rubric Evaluation (30 Marks)

#### Actions
1. In the Supervisor portal, click **Evaluations & Marks** (`/supervisor/evaluations`).
2. Select **Group 14** from the assigned projects dropdown.
3. Select Evaluation Phase: `SRS & Architecture Defense`.
4. Enter rubric scores across the 4 official criteria:
   - **Problem Formulation & Scope**: `9 / 10`
   - **Technical Methodology & Architecture**: `9 / 10`
   - **Implementation & Prototype Progress**: `5 / 5`
   - **Presentation & Viva Defense**: `4 / 5`
5. Computed Total: Displays `27 / 30 (90%)`.
6. Enter qualitative remarks: `Outstanding mathematical formulation of loss functions. Ensure dataset augmentation is complete before mid-term.`
7. Click **Save & Finalize Evaluation**.

#### Expected Visual Results on Screen
- Toast alert: *"Evaluation scores recorded and submitted to departmental records."*
- The evaluation summary card locks in the score of `27 / 30`.
- Return to the Student portal: The notification alerts the student that their milestone has been graded with 27/30 marks.

---

### Phase 10: Feedback & Discussion Channel Verification

#### Actions
1. In the Student portal, navigate to **Feedback** (`/student/feedback`).
2. Type a message: `Dear Dr. Imran Shah, we have integrated the mandi arrival dataset with 5-year historical records. Please review the schema.`
3. Click **Send Message**.
4. Switch to the Supervisor portal and navigate to **Feedback** (`/supervisor/feedback`).
5. Select Group 14.
6. The student's message is immediately visible in the threaded chat.
7. Reply: `Schema looks solid. Proceed with feature scaling and train-test splits.`
8. Click **Send Reply**.
9. Both messages persist in the relational `feedback` table.

---

### Phase 11: Coordinator Portal - Academic Calendar & Milestone Management

#### Actions
1. In the Coordinator portal, click **Milestones** (`/coordinator/milestones`).
2. View the 5 official department stages:
   - Proposal Defense (Weight 10%)
   - Software Requirements Specification (Weight 15%)
   - Mid-Term Architecture Defense (Weight 25%)
   - Final Implementation & Code Audit (Weight 30%)
   - External Viva & Thesis Defense (Weight 20%)
3. Click **Edit Deadline** on Mid-Term Defense.
4. Set the date to `2026-11-20`.
5. Click **Save & Broadcast Alert**.

#### Expected Visual Results on Screen
- Toast alert confirms: *"Milestone deadline updated and broadcasted to all departmental candidates and faculty."*
- Student and Supervisor portals receive a system-wide calendar reminder.

---

### Phase 12: Coordinator Portal - Accreditation Metric Audits & PDF Generation

#### Actions
1. In the Coordinator portal, click **Reports** (`/coordinator/reports`).
2. Inspect the analytics cards:
   - Department On-Time Rate: `91.6%`
   - Cohort Average Score: `79.4`
   - Total Project Artifacts: `384`
   - Accreditation Readiness: `100%`
3. Click **Generate Accreditation PDF**.

#### Expected Visual Results on Screen
- A clean, professional modal opens displaying the official institutional accreditation summary with:
  - Departmental project count
  - Faculty supervision quota balance
  - Originality compliance rate
  - Rubric continuous evaluation averages
- Click **Print / Save as PDF** to generate an official hardcopy report.

---

## 5. Edge Cases & High-Similarity Plagiarism Test Case

To verify that the AI similarity system properly catches plagiarized or duplicate submissions:

1. Log in as any student or register a new account (`teststudent@university.edu`).
2. Submit a proposal that deliberately copies a past thesis:
   - **Title**: *Fabric Defect Detection on Edge TPU*
   - **Domain**: *Computer Vision & Embedded*
   - **Abstract**: *Embedded camera utilizing quantized MobileNet SSD running on Coral Edge TPU for defect localization and weave warp inconsistency detection on high-speed industrial textile looms.*
3. Submit the proposal.
4. Log in as Coordinator and open **Similarity** (`/coordinator/similarity`).
5. **Expected Result**:
   - The proposal is immediately flagged with a red badge: `85% Overlap - High Risk`.
   - The status is marked: `Review Required (High Overlap Detected)`.
   - The inspector side-by-side shows an exact match with historical thesis `ARCH-2022-072`.
   - The coordinator clicks **Require Topic Revision**; a revision order is dispatched to the student, blocking proposal approval.

---

## 6. System Verification Matrix

| Test Step | Component Tested | Pre-Conditions | Expected Result | Status |
| :---: | :--- | :--- | :--- | :---: |
| 1 | Student Proposal Submission | Student logged in | Saved to database with status `Submitted` | PASSED |
| 2 | Dynamic Group Members | Proposal submitted | Renders real members and `You` badge; no hardcoded demo names | PASSED |
| 3 | AI Similarity Audit | 25+ benchmark pool | Automatic overlap percentage computed against archive | PASSED |
| 4 | AI Supervisor Recommendation | Project unassigned | Faculty ranked with AI Match Score, reasons, and quotas | PASSED |
| 5 | Supervisor Allocation | Capacity limits active | Faculty assigned, quota decrements by 1 | PASSED |
| 6 | Proposal Ratification | Coordinator logged in | Status updates to `Approved`, notification sent | PASSED |
| 7 | Live Notification Polling | No page reload | Badge counter increments within 8s | PASSED |
| 8 | Deliverable File Upload | PDF/DOCX selected | Stored on server disk `backend/uploads/` | PASSED |
| 9 | Deliverable File Download | Supervisor logged in | Streams exact binary file from server | PASSED |
| 10 | Rubric Continuous Evaluation | 4 criteria (30 marks) | Marks computed, recorded in database, student notified | PASSED |
| 11 | Threaded Feedback Chat | Both parties online | Messages persist and display in chronological order | PASSED |
| 12 | Department Settings | Quotas configured | Enforced in student proposal and supervisor allocations | PASSED |
| 13 | High Plagiarism Flag | Duplicate abstract | Flagged with red `High Risk` badge and blocked | PASSED |
| 14 | Accreditation PDF Export | Coordinator portal | Generates formatted institutional compliance summary | PASSED |
| 15 | Zero Emojis Compliance | Repository-wide | Entire codebase, UI, and docs have 0 emoji characters | PASSED |
