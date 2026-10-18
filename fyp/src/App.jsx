import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

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
          navigate("/student/dashboard");
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
            <ProtectedRoute>
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

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
