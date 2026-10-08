import mainImage from "../../assets/main.jpg";
import BrandingPanel from "./BrandingPanel";

function AuthLayout() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${mainImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex min-h-screen items-center justify-start gap-8 px-16 py-8 rounded-t-3xl">
        <BrandingPanel />

        <div className="h-[500px] w-[450px] bg-white">
          Right Section
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;