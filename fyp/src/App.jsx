import { useState, useEffect } from "react";
import AuthLayout from "./components/Auth/AuthLayout";
import SignUpLayout from "./components/Auth/SignUpLayout";
import ForgotPasswordLayout from "./components/Auth/ForgotPasswordLayout";
import ResetPasswordLayout from "./components/Auth/ResetPasswordLayout";
import WelcomePage from "./components/Auth/WelcomePage";
import {
  getStoredToken,
  getStoredUser,
  clearStoredSession,
  setStoredSession,
} from "./services/auth";
import "./App.css";

function App() {
  const [view, setView] = useState("login"); // 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'welcome'
  const [currentUser, setCurrentUser] = useState(null);
  const [notice, setNotice] = useState("");
  const [authSource, setAuthSource] = useState("login"); // 'login' | 'signup'
  const [resetToken, setResetToken] = useState("");

  // Check URL query parameters on initial mount (e.g., reset password link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    const tokenParam = params.get("token");

    if (viewParam === "reset-password" && tokenParam) {
      setResetToken(tokenParam);
      setView("reset-password");
      return;
    }

    // Check if user has an active saved session
    const savedToken = getStoredToken();
    const savedUser = getStoredUser();
    if (savedToken && savedUser) {
      setCurrentUser(savedUser);
      // We can start at welcome if user is already logged in
      setView("welcome");
    }
  }, []);

  function handleLoginSuccess(response) {
    if (response?.user) {
      setCurrentUser(response.user);
      setStoredSession(response.access_token, response.user);
    }
    setNotice("");
    setAuthSource("login");
    setView("welcome");
  }

  function handleSignUpSuccess(response) {
    if (response?.user) {
      setCurrentUser(response.user);
      if (response.access_token) {
        setStoredSession(response.access_token, response.user);
      }
    } else {
      // In case response is just a string message
      setNotice(typeof response === "string" ? response : "Registration successful!");
    }
    setAuthSource("signup");
    setView("welcome");
  }

  function handleLogout() {
    clearStoredSession();
    setCurrentUser(null);
    setNotice("You have been signed out successfully.");
    setView("login");
  }

  function handleBackToLogin() {
    setNotice("");
    setView("login");
  }

  return (
    <div className="min-h-screen w-full bg-slate-900 font-sans antialiased text-slate-800">
      {view === "welcome" && (
        <WelcomePage
          user={currentUser}
          role={currentUser?.role}
          source={authSource}
          onLogout={handleLogout}
        />
      )}

      {view === "login" && (
        <AuthLayout
          notice={notice}
          onSignUp={() => {
            setNotice("");
            setView("signup");
          }}
          onLoginSuccess={handleLoginSuccess}
          onForgotPassword={() => {
            setNotice("");
            setView("forgot-password");
          }}
        />
      )}

      {view === "signup" && (
        <SignUpLayout
          onBackToLogin={handleBackToLogin}
          onRegistered={handleSignUpSuccess}
        />
      )}

      {view === "forgot-password" && (
        <ForgotPasswordLayout onBackToLogin={handleBackToLogin} />
      )}

      {view === "reset-password" && (
        <ResetPasswordLayout
          token={resetToken}
          onBackToLogin={handleBackToLogin}
        />
      )}
    </div>
  );
}

export default App;
