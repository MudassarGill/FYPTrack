import { Navigate, useLocation } from "react-router-dom";
import { getStoredToken, getStoredUser } from "../services/auth";

export default function ProtectedRoute({ children, allowDemo = true, requiredRole }) {
  const location = useLocation();
  const token = getStoredToken();
  const user = getStoredUser();

  // If user is logged in, perform role checks
  if (token || user) {
    if (requiredRole && user?.role && user.role !== requiredRole) {
      if (user.role === "supervisor") {
        return <Navigate to="/supervisor/overview" replace />;
      }
      return <Navigate to="/student/dashboard" replace />;
    }
    return children;
  }

  // If allowDemo is enabled, users can preview portals with mock data
  if (allowDemo) {
    return children;
  }

  // Otherwise redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
}
