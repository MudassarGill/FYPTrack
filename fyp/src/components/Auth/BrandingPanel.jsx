import logo from "../../assets/logo.jpg";

function BrandingPanel() {
  return (
    <div
      className="relative flex w-full max-w-[480px] flex-col items-center overflow-hidden rounded-2xl border border-white px-5 py-5 text-center shadow-2xl sm:px-8 sm:py-6 xl:h-[560px] xl:shrink-0 xl:rounded-t-3xl xl:px-12 xl:py-12"
      style={{
        clipPath: "polygon(0 0, 100% 0, 92% 100%, 6% 100%)",
        background:
          "linear-gradient(145deg, rgba(15, 23, 42, 0.55), rgba(50, 64, 170, 0.72))",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#EBB44B]/15"></div>

      {/* Styled Rounded Logo at top */}
      <div className="relative z-10 mb-2 flex h-14 w-14 items-center justify-center rounded-2xl border border-white bg-white/10 p-1.5 shadow-2xl backdrop-blur-sm sm:h-16 sm:w-16 xl:h-20 xl:w-20 xl:rounded-3xl">
        <img
          src={logo}
          alt="FYPTrack Logo"
          className="h-full w-full rounded-xl xl:rounded-2xl object-contain"
        />
      </div>

      {/* Brand Name */}
      <h1 className="relative z-10 mt-1 text-3xl font-bold tracking-tight text-white xl:mt-3 xl:text-5xl">
        FYP<span className="text-[#EBB44B]">Track</span>
      </h1>

      {/* Tagline */}
      <p className="relative z-10 mt-2 max-w-sm text-sm font-medium leading-relaxed text-[#CFE0D9] xl:mt-4 xl:text-lg">
        Intelligent FYP Management
        <br />
        & <span className="text-[#EBB44B]">Tracking System</span>
      </p>

      {/* Description */}
      <p className="relative z-10 mt-8 hidden max-w-sm text-sm leading-7 text-[#CFE0D9]/80 xl:block">
        Manage your final year project from proposal to defense — <span className="text-[#EBB44B]">AI-powered supervisor matching</span>, milestone tracking, and department-wide analytics in one platform.
      </p>

      {/* Bottom Feature */}
      <div className="relative z-10 mt-auto hidden items-center gap-3 rounded-2xl border border-[#EBB44B] bg-white/10 px-5 py-3 backdrop-blur-sm xl:flex">
        <div className="h-2.5 w-2.5 rounded-3xl bg-[#EBB44B]"></div>

        <span className="text-sm font-medium text-white">
          Simplifying FYP Coordination
        </span>
      </div>
    </div>
  );
}

export default BrandingPanel;