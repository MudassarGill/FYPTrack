import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import LandingPage from "./components/home/LandingPage";
import AuthLayout from "./components/auth/AuthLayout";
import SignUpLayout from "./components/auth/SignUpLayout";
import SupervisorActivationForm from "./components/auth/SupervisorActivationForm";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import StudentDashboardView from "./components/dashboard/StudentDashboardView";
import SupervisorDashboardView from "./components/dashboard/SupervisorDashboardView";
import CoordinatorDashboardView from "./components/dashboard/CoordinatorDashboardView";

/**
 * AuthContainer manages login, signup, and activation flows while
 * preserving 100% of the Phase 1 visual styling, validation, and states.
 */
function LoginPage() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showActivation, setShowActivation] = useState(false);
  const [notice, setNotice] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  if (showActivation) {
    return (
      <SupervisorActivationForm
        onBackToLogin={() => setShowActivation(false)}
        onActivated={(message) => {
          setNotice(message);
          setShowActivation(false);
        }}
      />
    );
  }

  if (showSignUp) {
    return (
      <SignUpLayout
        onBackToLogin={() => setShowSignUp(false)}
        onRegistered={(message) => {
          setNotice(message);
          setShowSignUp(false);
        }}
      />
    );
  }

  return (
    <AuthLayout
      onSignUp={() => {
        setNotice("");
        setShowSignUp(true);
      }}
      onActivateInvitation={() => {
        setNotice("");
        setShowActivation(true);
      }}
      notice={notice}
      onLoginSuccess={(response) => {
        login(response.access_token, response.user);
        setNotice("");
        const role = response.user?.role || "student";
        navigate(`/dashboard/${role}`);
      }}
    />
  );
}

function SignUpPage() {
  const navigate = useNavigate();

  return (
    <SignUpLayout
      onBackToLogin={() => navigate("/login")}
      onRegistered={() => {
        navigate("/login");
      }}
    />
  );
}

function ActivatePage() {
  const navigate = useNavigate();

  return (
    <SupervisorActivationForm
      onBackToLogin={() => navigate("/login")}
      onActivated={() => navigate("/login")}
    />
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Main Home / Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Phase 1 Preserved Auth Screens */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/activate" element={<ActivatePage />} />

      {/* Dashboards using React Router Outlet */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard/student" replace />} />
        <Route path="student" element={<StudentDashboardView />} />
        <Route path="supervisor" element={<SupervisorDashboardView />} />
        <Route path="coordinator" element={<CoordinatorDashboardView />} />
      </Route>

      {/* Route Aliases for direct convenience */}
      <Route path="/student" element={<Navigate to="/dashboard/student" replace />} />
      <Route path="/supervisor" element={<Navigate to="/dashboard/supervisor" replace />} />
      <Route path="/coordinator" element={<Navigate to="/dashboard/coordinator" replace />} />

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}