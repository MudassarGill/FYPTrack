import backgroundImage from "../../assets/main2.jpg";
import BrandingPanel from "./BrandingPanel";
import ResetPasswordForm from "./ResetPasswordForm";

function ResetPasswordLayout({ token, onBackToLogin }) {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-8 sm:px-6 xl:flex-row xl:justify-center xl:gap-10 xl:px-16">
        <BrandingPanel />

        <ResetPasswordForm token={token} onBackToLogin={onBackToLogin} />
      </div>
    </div>
  );
}

export default ResetPasswordLayout;
