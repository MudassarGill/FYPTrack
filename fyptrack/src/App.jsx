import { useCallback, useState } from "react";

import AuthLayout from "./components/auth/AuthLayout";
import SignUpLayout from "./components/auth/SignUpLayout";
import SupervisorActivationForm from "./components/auth/SupervisorActivationForm";
import WorkspaceDashboard from "./components/dashboard/WorkspaceDashboard";

function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showActivation, setShowActivation] = useState(false);
  const [notice, setNotice] = useState("");
  const [hasSession, setHasSession] = useState(() =>
    Boolean(sessionStorage.getItem("fyptrack_access_token")),
  );
  const handleSignOut = useCallback(() => {
    sessionStorage.removeItem("fyptrack_access_token");
    setHasSession(false);
    setNotice("You have been signed out.");
  }, [setHasSession, setNotice]);
  const handleSessionExpired = useCallback(() => {
    sessionStorage.removeItem("fyptrack_access_token");
    setHasSession(false);
    setNotice("Your session has expired. Please log in again.");
  }, [setHasSession, setNotice]);

  if (hasSession) {
    return (
      <WorkspaceDashboard
        onSignOut={handleSignOut}
        onSessionExpired={handleSessionExpired}
      />
    );
  }

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

  return (
    <>
      {showSignUp ? (
        <SignUpLayout
          onBackToLogin={() => setShowSignUp(false)}
          onRegistered={(message) => {
            setNotice(message);
            setShowSignUp(false);
          }}
        />
      ) : (
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
            sessionStorage.setItem("fyptrack_access_token", response.access_token);
            setNotice("");
            setHasSession(true);
          }}
        />
      )}
    </>
  );
}

export default App;