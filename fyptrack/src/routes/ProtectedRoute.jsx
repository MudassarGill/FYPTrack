import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingState from "../components/shared/LoadingState";

/**
 * Route guard that:
 * 1. Shows loading while auth is being validated
 * 2. Redirects unauthenticated users to /login
 * 3. Redirects role-mismatched users to their correct dashboard
 *
 * Frontend route guards improve navigation but are not a security boundary.
 * All protected data and actions are ultimately authorized by the FastAPI backend.
 */
function ProtectedRoute({ allowedRole, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState message="Verifying your session..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to the correct dashboard for this user's role
    const roleRoutes = {
      student: "/student",
      supervisor: "/supervisor",
      coordinator: "/coordinator",
    };
    const correctPath = roleRoutes[user.role] || "/login";
    return <Navigate to={correctPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
