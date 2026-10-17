import backgroundImage from "../../assets/main2.jpg";
import BrandingPanel from "./BrandingPanel";
import SignUpForm from "./SignUpForm";

function SignUpLayout({ onBackToLogin, onRegistered }) {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Light transparent overlay so the background image colors are clearly visible */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main content flex layout matching original styling */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-8 sm:px-6 xl:flex-row xl:justify-center xl:gap-10 xl:px-16">
        <BrandingPanel />

        <SignUpForm
          onBackToLogin={onBackToLogin}
          onRegistered={onRegistered}
        />
      </div>
    </div>
  );
}

export default SignUpLayout;