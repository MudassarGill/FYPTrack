import logo from "../../assets/logo.jpg";

function BrandingPanel() {
  return (
    <div
      className="relative flex h-[560px] w-[480px] flex-col items-center overflow-hidden px-12 py-12 text-center shadow-2xl"
      style={{
        clipPath: "polygon(0 0, 100% 0, 92% 100%, 6% 100%) ",
        background:
          "linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(30, 64, 175, 0.94))",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10"></div>

      <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-400/10"></div>

      {/* Logo */}
      <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-3xl bg-white p-3 shadow-xl">
        <img
          src={logo}
          alt="FYPTrack Logo"
          className="h-full w-full rounded-2xl object-contain"
        />
      </div>

      {/* Brand Name */}
      <h1 className="relative z-10 mt-7 text-5xl font-bold tracking-tight text-white">
        FYP<span className="text-blue-300">Track</span>
      </h1>

      {/* Tagline */}
      <p className="relative z-10 mt-4 max-w-sm text-lg font-medium leading-relaxed text-blue-100">
        Intelligent Final Year Project
        <br />
        Management & Automation System
      </p>

      {/* Description */}
      <p className="relative z-10 mt-8 max-w-sm text-sm leading-7 text-slate-300">
        Manage your final year project from proposal submission to final
        evaluation — all in one centralized platform.
      </p>

      {/* Bottom Feature */}
      <div className="relative z-10 mt-auto flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-sm">
        <div className="h-2.5 w-2.5 rounded-full bg-blue-300"></div>

        <span className="text-sm font-medium text-white">
          Simplifying FYP Management
        </span>
      </div>
    </div>
  );
}

export default BrandingPanel;