import { useState } from "react";

import AuthLayout from "./components/auth/AuthLayout";
import SignUpLayout from "./components/auth/SignUpLayout";
import WelcomePage, { isWelcomeRole } from "./components/auth/WelcomePage";

function App() {
  const welcomeRole = new URLSearchParams(window.location.search).get("welcome");
  const [showSignUp, setShowSignUp] = useState(false);
  const [notice, setNotice] = useState("");

  if (isWelcomeRole(welcomeRole)) {
    return <WelcomePage role={welcomeRole} />;
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
          notice={notice}
          onLoginSuccess={(message) => setNotice(message)}
        />
      )}
    </>
  );
}

export default App;