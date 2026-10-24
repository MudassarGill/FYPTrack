# FYPTrack — Testing Guide

> Step-by-step instructions to set up, run, and manually test every part of the FYPTrack application.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Project Setup](#2-project-setup)
   - [Backend (FastAPI)](#21-backend-fastapi)
   - [Frontend (React + Vite)](#22-frontend-react--vite)
3. [Seeded Test Accounts](#3-seeded-test-accounts)
4. [Testing the Public Landing Page](#4-testing-the-public-landing-page)
5. [Testing Authentication](#5-testing-authentication)
6. [Testing the Student Portal](#6-testing-the-student-portal)
7. [Testing the Supervisor Portal](#7-testing-the-supervisor-portal)
8. [Testing the Coordinator Portal](#8-testing-the-coordinator-portal)
9. [API Health Check](#9-api-health-check)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

Make sure the following are installed on your machine:

| Tool       | Version   | Check command          |
| ---------- | --------- | ---------------------- |
| **Node.js** | >= 18.x   | `node -v`             |
| **npm**     | >= 9.x    | `npm -v`              |
| **Python**  | >= 3.10   | `python --version`    |
| **pip**     | latest    | `pip --version`       |

---

## 2. Project Setup

### 2.1 Backend (FastAPI)

```bash
# Navigate to the backend folder
cd d:\FYPTrack\fyp\backend

# (Recommended) Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# Install Python dependencies
pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings python-jose[cryptography] bcrypt python-multipart

# Start the backend server
python main.py
```

The backend will start at **http://localhost:8000**.

- Swagger UI docs: **http://localhost:8000/docs**
- API health check: **http://localhost:8000/api/health**

> **Note:** On first run, the database (`fyptrack.db`) is automatically created and seeded with demo accounts and data. You do NOT need to run any migrations.

### 2.2 Frontend (React + Vite)

Open a **new terminal**:

```bash
# Navigate to the frontend folder
cd d:\FYPTrack\fyp

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start at **http://localhost:5173**.

> Make sure the backend is running **before** testing any authenticated features.

---

## 3. Seeded Test Accounts

The backend automatically seeds the following accounts on first launch. All passwords are **`password123`**.

| Role           | Full Name              | Email                          | Password      |
| -------------- | ---------------------- | ------------------------------ | ------------- |
| **Student**    | Hamza Tariq            | `student@university.edu`       | `password123` |
| **Supervisor** | Dr. Imran Shah         | `supervisor@university.edu`    | `password123` |
| **Supervisor** | Dr. Noman Ali          | `noman.ali@university.edu`     | `password123` |
| **Supervisor** | Dr. Rabia Qazi         | `rabia.qazi@university.edu`    | `password123` |
| **Supervisor** | Dr. Farhan Jamil       | `farhan.jamil@university.edu`  | `password123` |
| **Coordinator**| Prof. Dr. Tariq Mahmood| `coordinator@university.edu`   | `password123` |

### Seeded Demo Data

- **Project:** "Crop Price Prediction and Market Advisory System" (Group 14, student Hamza Tariq, supervised by Dr. Imran Shah)
- **Feedback:** One supervisor feedback message from Dr. Imran Shah
- **Notification:** "Supervisor Assigned" notification for the student
- **Milestones:** 6 department milestones (Phase 1 to 6) with varying statuses (Completed, Active, Upcoming)

---

## 4. Testing the Public Landing Page

| #  | Test                                    | Steps                                                                 | Expected Result                                                    |
| -- | --------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1  | Page loads                              | Open `http://localhost:5173/`                                         | Landing page renders with hero section, navbar, and footer         |
| 2  | Navbar is sticky                        | Scroll down the page                                                  | Navbar stays fixed at the top                                      |
| 3  | Navbar logo                             | Look at the top-left of the navbar                                    | `fyplogo.png` logo is visible                                      |
| 4  | Navigation scroll links                 | Click "Features", "How It Works", "Rules", "FAQ", "Contact" in navbar | Page smooth-scrolls to the corresponding section                   |
| 5  | Hero section                            | Check the hero area                                                   | White text, green project card preview, CTA buttons visible        |
| 6  | "Create your account" button            | Click the green CTA button in hero                                    | Navigates to `/signup`                                             |
| 7  | "See how it works" link                 | Click the secondary link in hero                                      | Smooth-scrolls to the Workflow section                             |
| 8  | Features section                        | Scroll to the Features section                                        | 6 feature cards with images displayed in a white box               |
| 9  | Workflow / How It Works                 | Scroll to the workflow section                                        | 3 numbered steps with descriptions                                 |
| 10 | Rules section                           | Scroll to the Rules section                                           | Rules cards with shadow displayed                                  |
| 11 | FAQ section                             | Click on any FAQ question                                             | Answer toggles open/closed                                         |
| 12 | Contact section                         | Scroll to the Contact section                                         | Contact info box and contact form visible                          |
| 13 | Footer                                  | Scroll to the bottom                                                  | 4-column footer rendered                                           |
| 14 | "Log in" navbar button                  | Click "Log in" in the navbar                                          | Navigates to `/login`                                              |
| 15 | "Get Started" navbar button             | Click "Get Started" in the navbar                                     | Navigates to `/signup`                                             |
| 16 | Continue without login                  | Click "Continue without login" (if present on login page)             | Navigates to the public home page `/`                              |

---

## 5. Testing Authentication

### 5.1 Sign Up (New Account)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Open signup page              | Go to `http://localhost:5173/signup`                                     | Sign up form is displayed                                  |
| 2  | Register a new student        | Fill: Name = `Test Student`, Email = `test@university.edu`, Password = `password123`, Role = Student. Submit. | Account created, redirected to `/student/dashboard`        |
| 3  | Duplicate email               | Try to register again with `student@university.edu`                      | Error message: "An account with this email already exists" |

### 5.2 Log In

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Open login page               | Go to `http://localhost:5173/login`                                      | Login form is displayed                                    |
| 2  | Login as Student              | Email: `student@university.edu`, Password: `password123`                 | Redirected to `/student/dashboard`                         |
| 3  | Login as Supervisor           | Email: `supervisor@university.edu`, Password: `password123`              | Redirected to `/supervisor/overview`                       |
| 4  | Login as Coordinator          | Email: `coordinator@university.edu`, Password: `password123`             | Redirected to `/coordinator/overview`                      |
| 5  | Wrong password                | Email: `student@university.edu`, Password: `wrongpass`                   | Error message: "Invalid email or password"                 |
| 6  | Empty fields                  | Leave email or password blank, click submit                              | Validation error shown                                     |

### 5.3 Forgot / Reset Password

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Open forgot password          | Go to `http://localhost:5173/forgot-password`                            | Forgot password form displayed                             |
| 2  | Submit email                  | Enter a registered email and submit                                      | Confirmation message shown                                 |
| 3  | Back to login                 | Click "Back to Login" link                                               | Navigates back to `/login`                                 |

---

## 6. Testing the Student Portal

> **Login first:** Email: `student@university.edu` / Password: `password123`

### 6.1 Dashboard (`/student/dashboard`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Dashboard loads               | After login, check the dashboard                                         | Dashboard renders with charts, project info, quick access  |
| 2  | Area chart                    | Look at the progress area chart                                          | Recharts area chart renders with milestone data            |
| 3  | Donut chart                   | Look at the donut/pie chart                                              | Completion donut chart visible                             |
| 4  | Project info card             | Check the project details card                                           | Shows "Crop Price Prediction..." title, Group 14, supervisor name |
| 5  | Quick access boxes            | Click on quick access links (Proposal, Milestones, Documents, etc.)     | Navigate to the respective student portal pages            |
| 6  | Coordinator contact form      | Fill in the "Contact Coordinator" form and submit                        | Form submits (check network tab for API call)              |

### 6.2 Proposal (`/student/proposal`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to Proposal from sidebar                                        | Proposal page renders                                      |
| 2  | View existing proposal        | Check the proposal details                                               | Shows submitted proposal with title, abstract, domain      |
| 3  | Edit proposal fields          | Try editing the proposal title or abstract                               | Fields become editable (if status allows)                  |
| 4  | Submit updated proposal       | Make changes and click Submit/Update                                     | Success message, proposal version incremented              |

### 6.3 Project (`/student/project`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to Project from sidebar                                         | Project overview page renders                              |
| 2  | Project details               | Check project title, domain, technologies, group members                 | All seeded data displayed correctly                        |
| 3  | Supervisor info               | Check the supervisor card                                                | Shows "Dr. Imran Shah"                                     |
| 4  | Supervisor feedback           | Check the feedback section                                               | Shows the seeded feedback message                          |

### 6.4 Milestones (`/student/milestones`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to Milestones from sidebar                                      | Milestones page with bar chart and donut chart renders     |
| 2  | Milestone list                | Check the milestones table/cards                                         | 6 milestones listed (Phase 1 to 6) with deadlines and status |
| 3  | Status indicators             | Check the status badges                                                  | "Completed" = green, "Active" = blue, "Upcoming" = gray   |

### 6.5 Documents (`/student/documents`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to Documents from sidebar                                       | Documents page with upload area renders                    |
| 2  | File upload area              | Check the drag-and-drop or click-to-upload area                          | Upload zone is visible and interactive                     |
| 3  | Upload a file                 | Select or drag a file into the upload area                               | File appears in the submitted files list                   |

### 6.6 Feedback (`/student/feedback`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to Feedback from sidebar                                        | Feedback thread page renders                               |
| 2  | View feedback                 | Check the feedback messages                                              | Shows seeded supervisor feedback from Dr. Imran Shah       |
| 3  | Reply                         | Type a reply message and submit                                          | Reply appears in the thread                                |

### 6.7 Notifications (`/student/notifications`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to Notifications from sidebar                                   | Notifications list renders                                 |
| 2  | View notification             | Check the seeded notification                                            | Shows "Supervisor Assigned" notification                   |
| 3  | Mark as read                  | Click/interact with the notification                                     | Read state updates visually                                |

### 6.8 Profile (`/student/profile`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to Profile from sidebar                                         | Profile page renders with user info                        |
| 2  | View academic info            | Check the displayed user information                                     | Shows "Hamza Tariq", email, role: student                  |
| 3  | Update password               | Enter new password in the password change form and submit                | Success message shown                                      |

---

## 7. Testing the Supervisor Portal

> **Login:** Email: `supervisor@university.edu` / Password: `password123`

### 7.1 Overview (`/supervisor/overview`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | After login, check overview dashboard                                    | Overview renders with stats and assigned project info      |

### 7.2 My Students (`/supervisor/students`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to My Students from sidebar                                     | Student list renders                                       |
| 2  | View assigned student         | Check for Hamza Tariq in the list                                        | Student card/row visible with project info                 |

### 7.3 My Projects (`/supervisor/projects`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to My Projects from sidebar                                     | Projects list renders                                      |
| 2  | View project                  | Check for "Crop Price Prediction..." project                             | Project details visible                                    |

### 7.4 Proposal Reviews (`/supervisor/proposals`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to Proposal Reviews from sidebar                                | Proposals pending review shown                             |

### 7.5 Document Reviews (`/supervisor/documents`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to Document Reviews from sidebar                                | Document review interface renders                          |

### 7.6 Milestone Reviews (`/supervisor/milestones`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to Milestone Reviews from sidebar                               | Milestone review interface renders                         |

### 7.7 Evaluations (`/supervisor/evaluations`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to Evaluations from sidebar                                     | Evaluation form/interface renders                          |

### 7.8 Feedback, Notifications, Profile

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Feedback page                 | Navigate to `/supervisor/feedback`                                       | Feedback thread interface renders                          |
| 2  | Notifications page            | Navigate to `/supervisor/notifications`                                  | Notifications list renders                                 |
| 3  | Profile page                  | Navigate to `/supervisor/profile`                                        | Profile info shown for Dr. Imran Shah                      |

---

## 8. Testing the Coordinator Portal

> **Login:** Email: `coordinator@university.edu` / Password: `password123`

### 8.1 Overview (`/coordinator/overview`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | After login, check coordinator overview                                  | Dashboard renders with department-wide stats               |

### 8.2 Proposals (`/coordinator/proposals`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to Proposals from sidebar                                       | All submitted proposals listed                             |
| 2  | Review a proposal             | Click on the "Crop Price Prediction..." proposal                         | Proposal details shown with approve/reject options         |

### 8.3 Supervisor Allocation (`/coordinator/supervisors`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to Supervisor Allocation from sidebar                           | Supervisor list with availability/slots shown              |

### 8.4 Similarity Checker (`/coordinator/similarity`)

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Page loads                    | Navigate to Similarity Checker from sidebar                              | Similarity analysis interface renders                      |

### 8.5 Projects, Students, Milestones, Reports

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Projects page                 | Navigate to `/coordinator/projects`                                      | All department projects listed                             |
| 2  | Students page                 | Navigate to `/coordinator/students`                                      | All students listed                                        |
| 3  | Deadlines and Milestones page | Navigate to `/coordinator/milestones`                                    | Milestone management interface renders                     |
| 4  | Analytics and Reports page    | Navigate to `/coordinator/reports`                                       | Analytics dashboard renders                                |

### 8.6 Notifications and Profile

| #  | Test                          | Steps                                                                   | Expected Result                                            |
| -- | ----------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | Notifications                 | Navigate to `/coordinator/notifications`                                 | Notifications list renders                                 |
| 2  | Profile                       | Navigate to `/coordinator/profile`                                       | Profile info shown for Prof. Dr. Tariq Mahmood             |

---

## 9. API Health Check

You can verify the backend API is running correctly by visiting these URLs directly:

| Endpoint                           | Expected Response                                           |
| ---------------------------------- | ----------------------------------------------------------- |
| `http://localhost:8000/`           | `{ "message": "FYPTrack Auth API is running smoothly", ... }` |
| `http://localhost:8000/api/health` | `{ "status": "ok" }`                                        |
| `http://localhost:8000/docs`       | Swagger UI interactive API documentation                     |

### Quick API Test with cURL

```bash
# Health check
curl http://localhost:8000/api/health

# Login and get token
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d "{\"email\": \"student@university.edu\", \"password\": \"password123\"}"

# Register a new user
curl -X POST http://localhost:8000/api/auth/register -H "Content-Type: application/json" -d "{\"full_name\": \"New Student\", \"email\": \"new@university.edu\", \"password\": \"password123\", \"role\": \"student\"}"
```

---

## 10. Troubleshooting

| Problem                                       | Solution                                                                                                   |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `npm run dev` fails                           | Run `npm install` first. Make sure Node.js >= 18 is installed.                                              |
| Backend won't start                           | Make sure all Python packages are installed (see Section 2.1)                                               |
| `ModuleNotFoundError`                         | Install the missing package with `pip install <package-name>`                                               |
| Port 8000 already in use                      | Kill the process: `netstat -ano | findstr :8000` then `taskkill /PID <PID> /F`                              |
| Port 5173 already in use                      | Kill the process or Vite will auto-pick the next port (5174)                                                |
| Login redirects back to login                 | Clear browser localStorage (`localStorage.clear()` in DevTools console) and try again                      |
| CORS errors in browser console                | Make sure the backend is running on `http://localhost:8000` and `.env` has `VITE_API_BASE_URL=http://localhost:8000/api` |
| Database is empty / no seeded data            | Delete `backend/fyptrack.db` and restart the backend. It will recreate and re-seed automatically.           |
| Charts not rendering                          | Make sure `recharts@2.15.1` is installed: `npm ls recharts`. If missing: `npm install recharts@2.15.1`      |
| Blank page / white screen                     | Open browser DevTools (F12) and check the Console tab for JavaScript errors                                 |

---

## Quick Start Cheat Sheet

```bash
# Terminal 1 - Backend
cd d:\FYPTrack\fyp\backend
python main.py

# Terminal 2 - Frontend
cd d:\FYPTrack\fyp
npm run dev

# Open browser
# http://localhost:5173
```

**Student login:** `student@university.edu` / `password123`
**Supervisor login:** `supervisor@university.edu` / `password123`
**Coordinator login:** `coordinator@university.edu` / `password123`

---

*Generated for FYPTrack - Final Year Project Management System*
