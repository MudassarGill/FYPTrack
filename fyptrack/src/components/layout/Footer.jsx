import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid university or personal email address.");
      return;
    }
    setError("");
    setSubscribed(true);
  }

  return (
    <footer className="relative border-t border-emerald-950 bg-[#122420] text-slate-300">
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-4xl bg-gradient-to-r from-transparent via-[#E9B44C]/40 to-transparent"></div>

      {/* Newsletter / Email Subscription Box Section */}
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#E9B44C]/30 bg-gradient-to-br from-[#17302B] via-[#1a3832] to-[#122420] p-6 shadow-2xl sm:p-10 lg:p-12">
          {/* Background pattern */}
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-[#E9B44C]/10 blur-3xl"></div>
          <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E9B44C]/40 bg-[#E9B44C]/10 px-3.5 py-1 text-xs font-semibold text-[#E9B44C]">
                <span className="h-2 w-2 rounded-full bg-[#E9B44C] animate-pulse"></span>
                Academic Year 2026–2027 Circulars
              </div>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Stay Updated on FYP Deadlines &amp; Guidelines
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                Subscribe to instant notifications for proposal submission deadlines, defense timetables, supervisor allocation rounds, and university template releases.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/60 p-4 text-emerald-200 text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-2 font-bold text-emerald-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    Subscribed Successfully!
                  </div>
                  <p className="mt-1 text-xs text-emerald-300/80">
                    You will receive milestone alerts and notices at <span className="font-semibold text-white">{email}</span>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your university email..."
                      className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-[#E9B44C] focus:bg-white/15 focus:ring-2 focus:ring-[#E9B44C]/30"
                    />
                    <button
                      type="submit"
                      className="cursor-pointer whitespace-nowrap rounded-xl bg-gradient-to-r from-[#E9B44C] to-[#f4c873] px-6 py-3 text-sm font-bold text-[#17302B] shadow-lg shadow-[#E9B44C]/20 transition hover:brightness-105 active:scale-98"
                    >
                      Subscribe
                    </button>
                  </div>
                  {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
                  <p className="text-[11px] text-slate-400">
                    Protected by university privacy standards. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E9B44C] bg-white/10 p-1">
                <img src={logo} alt="FYPTrack" className="h-full w-full object-contain rounded-lg" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                FYP<span className="text-[#E9B44C]">Track</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-6 text-slate-400">
              An Intelligent Final Year Project Management and Automation System designed for universities. Empowering students, faculty supervisors, and coordinators through every milestone from proposal to graduation defense.
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-emerald-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              FastAPI + React 19 + PostgreSQL Powered
            </div>
          </div>

          {/* Column: Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Workspaces &amp; Portals
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/dashboard/student" className="transition hover:text-[#E9B44C]">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/supervisor" className="transition hover:text-[#E9B44C]">
                  Supervisor Desk
                </Link>
              </li>
              <li>
                <Link to="/dashboard/coordinator" className="transition hover:text-[#E9B44C]">
                  Coordinator Office
                </Link>
              </li>
              <li>
                <a href="#similarity-lab" className="transition hover:text-[#E9B44C]">
                  AI Similarity Engine
                </a>
              </li>
              <li>
                <Link to="/login" className="transition hover:text-[#E9B44C]">
                  University Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Academic Guidelines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Academic Resources
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <a href="#projects" className="transition hover:text-[#E9B44C]">
                  Previous Projects Archive
                </a>
              </li>
              <li>
                <a href="#supervisors" className="transition hover:text-[#E9B44C]">
                  Faculty Research Directory
                </a>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer">
                  FYP LaTeX Template v2.4
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer">
                  Defense Evaluation Rubric
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white cursor-pointer">
                  Plagiarism &amp; Ethics Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Column: Support & Helpdesk */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Help &amp; Coordinator
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>Department of Computer Science &amp; IT</li>
              <li>Engineering Wing, Level 3</li>
              <li>
                <span className="text-emerald-300">support@fyptrack.edu</span>
              </li>
              <li>Office Hours: Mon–Fri, 9am–5pm</li>
              <li className="pt-2">
                <Link
                  to="/signup"
                  className="inline-block rounded-lg border border-[#E9B44C]/40 bg-[#E9B44C]/10 px-3 py-1 text-xs font-semibold text-[#E9B44C] hover:bg-[#E9B44C] hover:text-[#17302B] transition"
                >
                  Create Student Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} FYPTrack University Automation System. All rights reserved.</p>
          <div className="mt-3 flex gap-4 sm:mt-0">
            <span className="hover:text-white cursor-pointer">Academic Integrity</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Privacy Notice</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Security Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
