import { useState } from "react";

import AuthLayout from "./components/auth/AuthLayout";
import SignUpLayout from "./components/auth/SignUpLayout";

function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [notice, setNotice] = useState("");

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