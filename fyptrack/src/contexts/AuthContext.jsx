import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../services/auth";

const AuthContext = createContext(null);

const TOKEN_KEY = "fyptrack_access_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(!!sessionStorage.getItem(TOKEN_KEY));
  const [error, setError] = useState(null);

  // Validate token on mount and when token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    let isCurrent = true;
    setLoading(true);
    setError(null);

    getCurrentUser(token)
      .then((currentUser) => {
        if (isCurrent) {
          setUser(currentUser);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isCurrent) {
          // Token invalid or expired — clear session
          sessionStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
          setLoading(false);
          setError("Your session has expired. Please log in again.");
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [token]);

  const login = useCallback((accessToken, userData) => {
    sessionStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);
    setUser(userData);
    setError(null);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, error, login, logout, clearError }),
    [user, token, loading, error, login, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
