import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ToastProvider } from "./components/shared/Toast";

// Existing Auth Components (preserved exactly as requested)
import AuthLayout from "./components/Auth/AuthLayout";
import SignUpLayout from "./components/Auth/SignUpLayout";
import ForgotPasswordLayout from "./components/Auth/ForgotPasswordLayout";
import ResetPasswordLayout from "./components/Auth/ResetPasswordLayout";
import WelcomePage from "./components/Auth/WelcomePage";

// Services
import {
  getStoredUser,
  setStoredSession,
  clearStoredSession,
} from "./services/auth";

// Public Pages
import Home from "./pages/Home";

// Portal Layout & Protected Route
import ProtectedRoute from "./components/ProtectedRoute";
import StudentLayout from "./layouts/StudentLayout";

// Student Portal Pages
import Dashboard from "./pages/student/Dashboard";
import Proposal from "./pages/student/Proposal";
import Project from "./pages/student/Project";
import Milestones from "./pages/student/Milestones";
import Documents from "./pages/student/Documents";
import Feedback from "./pages/student/Feedback";
import Notifications from "./pages/student/Notifications";
import Profile from "./pages/student/Profile";

// Supervisor Portal Layout & Pages
import SupervisorLayout from "./layouts/SupervisorLayout";
import SupervisorOverview from "./pages/supervisor/Overview";
import MyStudents from "./pages/supervisor/MyStudents";
import MyProjects from "./pages/supervisor/MyProjects";
import ProposalReviews from "./pages/supervisor/ProposalReviews";
import DocumentReviews from "./pages/supervisor/DocumentReviews";
import MilestoneReviews from "./pages/supervisor/MilestoneReviews";
import Evaluations from "./pages/supervisor/Evaluations";
import SupervisorFeedback from "./pages/supervisor/Feedback";
import SupervisorNotifications from "./pages/supervisor/Notifications";
import SupervisorProfile from "./pages/supervisor/Profile";

// Coordinator Portal Layout & Pages
import CoordinatorLayout from "./layouts/CoordinatorLayout";
import CoordinatorOverview from "./pages/coordinator/Overview";
import CoordinatorProposals from "./pages/coordinator/Proposals";
import SupervisorAllocation from "./pages/coordinator/SupervisorAllocation";
import SimilarityChecker from "./pages/coordinator/SimilarityChecker";
import CoordinatorProjects from "./pages/coordinator/Projects";
import CoordinatorStudents from "./pages/coordinator/Students";
import DeadlinesMilestones from "./pages/coordinator/DeadlinesMilestones";
import AnalyticsReports from "./pages/coordinator/AnalyticsReports";
import CoordinatorNotifications from "./pages/coordinator/Notifications";
import CoordinatorProfile from "./pages/coordinator/Profile";

import "./App.css";

/* ============================================================
   Auth Route Wrappers (Preserving existing component contracts)
   ============================================================ */
function LoginPage() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState("");

  return (
    <div className="min-h-screen w-full bg-slate-900 font-sans antialiased text-slate-800">
      <AuthLayout
        notice={notice}
        onSignUp={() => navigate("/signup")}
        onLoginSuccess={(response) => {
          if (response?.user) {
            setStoredSession(response.access_token, response.user);
          }
          const role = response?.user?.role;
          if (role === "coordinator") {
            navigate("/coordinator/overview");
          } else if (role === "supervisor") {
            navigate("/supervisor/overview");
          } else {
            navigate("/student/dashboard");
          }
        }}
        onForgotPassword={() => navigate("/forgot-password")}
      />
    </div>
  );
}

function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-900 font-sans antialiased text-slate-800">
      <SignUpLayout
        onBackToLogin={() => navigate("/login")}
        onRegistered={(response) => {
          if (response?.user && response?.access_token) {
            setStoredSession(response.access_token, response.user);
          }
          navigate("/student/dashboard");
        }}
      />
    </div>
  );
}

function ForgotPasswordPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-slate-900 font-sans antialiased text-slate-800">
      <ForgotPasswordLayout onBackToLogin={() => navigate("/login")} />
    </div>
  );
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  return (
    <div className="min-h-screen w-full bg-slate-900 font-sans antialiased text-slate-800">
      <ResetPasswordLayout
        token={token}
        onBackToLogin={() => navigate("/login")}
      />
    </div>
  );
}

function WelcomePageRoute() {
  const navigate = useNavigate();
  const user = getStoredUser();

  return (
    <div className="min-h-screen w-full bg-slate-900 font-sans antialiased text-slate-800">
      <WelcomePage
        user={user}
        role={user?.role || "student"}
        source="login"
        onLogout={() => {
          clearStoredSession();
          navigate("/login");
        }}
      />
    </div>
  );
}

/* ============================================================
   Main Application Router
   ============================================================ */
export default function App() {
  return (
    <ToastProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Home Page */}
        <Route path="/" element={<Home />} />

        {/* Existing Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/welcome" element={<WelcomePageRoute />} />

        {/* Protected Student Portal */}
        <Route
          path="/student"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="proposal" element={<Proposal />} />
          <Route path="project" element={<Project />} />
          <Route path="milestones" element={<Milestones />} />
          <Route path="documents" element={<Documents />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Protected Supervisor Portal */}
        <Route
          path="/supervisor"
          element={
            <ProtectedRoute requiredRole="supervisor">
              <SupervisorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/supervisor/overview" replace />} />
          <Route path="overview" element={<SupervisorOverview />} />
          <Route path="students" element={<MyStudents />} />
          <Route path="projects" element={<MyProjects />} />
          <Route path="proposals" element={<ProposalReviews />} />
          <Route path="documents" element={<DocumentReviews />} />
          <Route path="milestones" element={<MilestoneReviews />} />
          <Route path="evaluations" element={<Evaluations />} />
          <Route path="feedback" element={<SupervisorFeedback />} />
          <Route path="notifications" element={<SupervisorNotifications />} />
          <Route path="profile" element={<SupervisorProfile />} />
        </Route>

        {/* Protected Coordinator Portal */}
        <Route
          path="/coordinator"
          element={
            <ProtectedRoute requiredRole="coordinator">
              <CoordinatorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/coordinator/overview" replace />} />
          <Route path="overview" element={<CoordinatorOverview />} />
          <Route path="proposals" element={<CoordinatorProposals />} />
          <Route path="supervisors" element={<SupervisorAllocation />} />
          <Route path="similarity" element={<SimilarityChecker />} />
          <Route path="projects" element={<CoordinatorProjects />} />
          <Route path="students" element={<CoordinatorStudents />} />
          <Route path="milestones" element={<DeadlinesMilestones />} />
          <Route path="reports" element={<AnalyticsReports />} />
          <Route path="notifications" element={<CoordinatorNotifications />} />
          <Route path="profile" element={<CoordinatorProfile />} />
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ToastProvider>
  );
}
