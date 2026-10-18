import { Navigate, useLocation } from "react-router-dom";
import { getStoredToken, getStoredUser } from "../services/auth";

export default function ProtectedRoute({ children, allowDemo = true }) {
  const location = useLocation();
  const token = getStoredToken();
  const user = getStoredUser();

  // If user is logged in, grant access
  if (token || user) {
    return children;
  }

  // If allowDemo is enabled, students can preview the portal with mock data
  if (allowDemo) {
    return children;
  }

  // Otherwise redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
}
