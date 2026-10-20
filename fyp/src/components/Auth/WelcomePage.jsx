import { useState } from "react";
import backgroundImage from "../../assets/main2.jpg";
import logo from "../../assets/logo.jpg";

const RANDOM_GREETINGS = [
  " Welcome aboard! Your FYPTrack workspace is ready.",
  " Authentication Successful! Ready to track your final year project.",
  " Welcome to FYPTrack! Your department portal is primed and ready.",
  " Great to have you! Authentication is completely verified.",
  " Hello future innovator! Your project portal is active and ready.",
];

function WelcomePage({ user, role, onLogout, source = "login" }) {
  const [greetingIndex] = useState(() =>
    Math.floor(Math.random() * RANDOM_GREETINGS.length)
  );

  const displayName = user?.full_name || "Valued User";
  const displayEmail = user?.email || "user@university.edu";
  const displayRole = user?.role || role || "Student";
  const randomGreeting = RANDOM_GREETINGS[greetingIndex];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay with slight blur */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>

      {/* Main Container Card */}
      <main className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-white/30 bg-slate-900/85 p-6 shadow-2xl backdrop-blur-xl sm:p-10 text-white">
        
        {/* Top Header with Brand */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-2 shadow-inner">
            <img
              src={logo}
              alt="FYPTrack Logo"
              className="h-full w-full object-contain rounded-xl"
            />
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {source === "signup"
              ? "Account Created Successfully"
              : "Authentication Verified"}
          </div>

          <h1 className="welcome-text mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome, {displayName}!
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium max-w-md">
            {randomGreeting}
          </p>
        </div>

        {/* User Details & Phase Status Panel */}
        <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-slate-400 font-medium">Phase Status:</span>
            <span className="rounded-lg bg-orange-500/20 px-2.5 py-1 text-xs font-bold text-orange-400 border border-orange-500/30">
              Phase 1: Auth Completed 
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-slate-400 font-medium">Full Name:</span>
            <span className="font-semibold text-white">{displayName}</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-slate-400 font-medium">Email Address:</span>
            <span className="font-mono text-xs sm:text-sm text-blue-300 truncate max-w-[240px]">
              {displayEmail}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Role:</span>
            <span className="capitalize font-semibold text-emerald-300">
              {displayRole}
            </span>
          </div>
        </div>

        {/* Informative Note for User */}
        <div className="mt-6 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-xs text-blue-200 leading-relaxed">
          <p className="font-semibold text-blue-100 mb-1">
            Login &amp; Sign-Up verification complete!
          </p>
          You are now logged in and your backend session token is securely stored.
          Next phases (Student Dashboard, Supervisor modules, etc.) can now be connected.
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex-1 cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-center text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-800 active:scale-[0.98]"
          >
            Log Out / Back to Login
          </button>
        </div>
      </main>
    </div>
  );
}

export default WelcomePage;
