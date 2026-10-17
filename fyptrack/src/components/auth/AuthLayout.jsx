import { Link } from "react-router-dom";
import mainImage from "../../assets/main.jpg";
import BrandingPanel from "./BrandingPanel";
import AuthForm from "./AuthForm";

function AuthLayout({ onSignUp, onActivateInvitation, notice, onLoginSuccess }) {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${mainImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Top Left Navigation Link */}
      <div className="relative z-20 pt-4 px-6 xl:px-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[#17302B]/80 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20 hover:bg-[#17302B] hover:border-[#E9B44C] transition"
        >
          <span>← Back to FYPTrack Portal</span>
        </Link>
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-60px)] flex-col items-center justify-start gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:justify-start xl:gap-8 xl:px-16 xl:py-4">
        <BrandingPanel />

        <AuthForm
          onSignUp={onSignUp}
          onActivateInvitation={onActivateInvitation}
          notice={notice}
          onLoginSuccess={onLoginSuccess}
        />
      </div>
    </div>
  );
}

export default AuthLayout;