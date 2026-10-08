import mainImage from "../../assets/main.jpg";
import BrandingPanel from "./BrandingPanel";
import SignUpForm from "./SignUpForm";

function SignUpLayout({ onBackToLogin }) {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${mainImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex min-h-screen items-center justify-start gap-8 px-16 py-8">
        <BrandingPanel />

        <SignUpForm onBackToLogin={onBackToLogin} />
      </div>
    </div>
  );
}

export default SignUpLayout;