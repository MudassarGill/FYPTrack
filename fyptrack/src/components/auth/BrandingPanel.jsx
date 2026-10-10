import logo from "../../assets/logo.jpg";

function BrandingPanel() {
  return (
    <div
      className="relative flex h-[560px] w-[480px] flex-col items-center overflow-hidden px-12 py-12 text-center shadow-2xl rounded-t-3xl border border-white "
      style={{
        clipPath: "polygon(0 0, 100% 0, 92% 100%, 6% 100%) ",
        background:
          "linear-gradient(145deg, rgba(15, 23, 42, 0.55), rgba(50, 64, 170, 0.72))"
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/20"></div>

      <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-400/20 "></div>

      {/* Logo */}
      <div className="absolute z-10 -ml-80 mt-10 flex h-20 w-20 items-center justify-center rounded-3xl  p-1 shadow-3xl border border-white bg-white/10 backdrop-blur-sm">
        <img
          src={logo}
          alt="FYPTrack Logo"
          className="h-full w-full rounded-xl object-contain"
        />
      </div>

      {/* Brand Name */}
      <h1 className="relative mt-15 z-10  text-5xl font-bold tracking-tight text-white">
        FYP<span className="text-orange-500">Track</span>
      </h1>

      {/* Tagline */}
      <p className="relative z-10 mt-4 max-w-sm text-lg font-medium leading-relaxed text-blue-100">
        Intelligent Final Year Project
        <br />
        Management & <span className="text-orange-500">Automation System</span>
      </p>

      {/* Description */}
      <p className="relative z-10 mt-10 max-w-sm text-sm leading-7 text-slate-300">
        Manage your final year project from proposal submission to <span className="text-orange-500">final
        evaluation</span> — all in one centralized platform.
      </p>

      {/* Bottom Feature */}
      <div className="relative z-10 mt-auto flex items-center gap-3 rounded-2xl border border-orange-500 bg-white/20 px-5 py-3 backdrop-blur-sm">
        <div className="h-2.5 w-2.5 rounded-3xl bg-orange-500"></div>

        <span className="text-sm font-medium text-white">
          Simplifying FYP Management
        </span>
      </div>
    </div>
  );
}
export default BrandingPanel;