import { useState } from "react";

import AuthLayout from "./components/auth/AuthLayout";
import SignUpLayout from "./components/auth/SignUpLayout";

function App() {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      {showSignUp ? (
        <SignUpLayout onBackToLogin={() => setShowSignUp(false)} />
      ) : (
        <AuthLayout onSignUp={() => setShowSignUp(true)} />
      )}
    </>
  );
}

export default App;