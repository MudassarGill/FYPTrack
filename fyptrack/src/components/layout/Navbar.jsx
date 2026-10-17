import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 15);
    }
    function handleClickOutside(e) {
      if (!e.target.closest("[data-menu-container]")) {
        setProfileMenuOpen(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Portals", path: "/#portals" },
    { name: "Previous Projects", path: "/#projects" },
    { name: "AI Similarity Lab", path: "/#similarity-lab" },
    { name: "Supervisors & Skills", path: "/#supervisors" },
    { name: "FYP Roadmap", path: "/#roadmap" },
  ];

  function handleNavClick(e, path) {
    if (path.startsWith("/#")) {
      e.preventDefault();
      const targetId = path.replace("/#", "");
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  const userInitial = user?.full_name ? user.full_name[0].toUpperCase() : "U";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#17302B]/95 backdrop-blur-md shadow-xl border-b border-[#E9B44C]/20 py-2.5"
          : "bg-[#17302B] border-b border-white/10 py-3.5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Logo & Brand */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[#E9B44C]/50 bg-white/10 p-1 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:border-[#E9B44C]">
            <img
              src={logo}
              alt="FYPTrack Logo"
              className="h-full w-full rounded-lg object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">
                FYP<span className="text-[#E9B44C]">Track</span>
              </span>
              <span className="rounded-full bg-[#E9B44C]/20 px-2 py-0.5 text-[10px] font-semibold text-[#E9B44C] border border-[#E9B44C]/30">
                v2.0
              </span>
            </div>
            <span className="text-[10px] font-medium tracking-wide text-emerald-200/70 hidden sm:block">
              Intelligent FYP Management & Automation
            </span>
          </div>
        </Link>

        {/* Center Menu: Navigation items with hover animated bottom line */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={(e) => handleNavClick(e, link.path)}
              className="group relative px-3 py-2 text-sm font-medium text-slate-200 transition-colors duration-200 hover:text-white"
            >
              <span>{link.name}</span>
              {/* Bottom animated line indicator on hover */}
              <span className="absolute bottom-0 left-0 h-[2.5px] w-0 bg-gradient-to-r from-[#E9B44C] to-[#f7d58a] transition-all duration-300 ease-out group-hover:w-full rounded-full shadow-[0_1px_6px_rgba(233,180,76,0.8)]" />
            </a>
          ))}
        </nav>

        {/* Right Side: Quick Portal Links & Profile Icon */}
        <div className="flex items-center gap-3">
          {/* Quick Dashboards Dropdown / Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/dashboard/student"
              className="relative px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition group"
            >
              <span>Student</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-[#E9B44C] transition-all duration-300 group-hover:w-4/5"></span>
            </Link>
            <Link
              to="/dashboard/supervisor"
              className="relative px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition group"
            >
              <span>Supervisor</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-[#E9B44C] transition-all duration-300 group-hover:w-4/5"></span>
            </Link>
            <Link
              to="/dashboard/coordinator"
              className="relative px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition group"
            >
              <span>Coordinator</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-[#E9B44C] transition-all duration-300 group-hover:w-4/5"></span>
            </Link>
          </div>

          {/* User Profile Icon & Dropdown */}
          <div className="relative" data-menu-container="true">
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="relative flex items-center gap-2 rounded-full border-2 border-[#E9B44C]/60 bg-[#1e3e38] p-1 text-sm transition hover:border-[#E9B44C] hover:shadow-[0_0_12px_rgba(233,180,76,0.4)] focus:outline-none"
              title="User Account & Roles"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#E9B44C] to-[#fae19b] text-xs font-bold text-[#17302B] shadow-inner">
                {user ? userInitial : (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <span className="hidden md:inline-block pr-2 text-xs font-semibold text-white">
                {user?.full_name ? user.full_name.split(" ")[0] : "Portals"}
              </span>
              <svg
                className={`h-3.5 w-3.5 text-emerald-300 transition-transform duration-200 mr-1 hidden sm:block ${
                  profileMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Menu Dropdown */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-white/15 bg-[#17302B] p-2 text-white shadow-2xl backdrop-blur-xl ring-1 ring-black/20 z-50">
                {user ? (
                  <div className="border-b border-white/10 px-3 py-2.5">
                    <p className="text-xs text-emerald-300/80">Signed in as</p>
                    <p className="font-semibold text-sm truncate text-white">{user.full_name}</p>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[140px]">{user.email}</span>
                      <span className="rounded-md bg-[#E9B44C]/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#E9B44C] border border-[#E9B44C]/30">
                        {user.role}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="border-b border-white/10 px-3 py-2.5">
                    <p className="text-xs text-emerald-300/80">FYPTrack Access</p>
                    <p className="font-bold text-sm text-white">Guest / Demo Mode</p>
                    <p className="mt-0.5 text-[11px] text-slate-300">
                      Explore all 3 university dashboards below:
                    </p>
                  </div>
                )}

                {/* Dashboard Options */}
                <div className="py-1">
                  <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#E9B44C]">
                    University Dashboards
                  </p>
                  <Link
                    to="/dashboard/student"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-[#E9B44C] text-[10px] font-bold">
                      ST
                    </span>
                    <div>
                      <div className="font-semibold">Student Dashboard</div>
                      <div className="text-[10px] text-slate-300">Proposals, Milestones & AI Check</div>
                    </div>
                  </Link>

                  <Link
                    to="/dashboard/supervisor"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-[#E9B44C] text-[10px] font-bold">
                      SV
                    </span>
                    <div>
                      <div className="font-semibold">Supervisor Workspace</div>
                      <div className="text-[10px] text-slate-300">Assigned FYPs & Skills Manager</div>
                    </div>
                  </Link>

                  <Link
                    to="/dashboard/coordinator"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20 text-[#E9B44C] text-[10px] font-bold">
                      CD
                    </span>
                    <div>
                      <div className="font-semibold">Coordinator Desk</div>
                      <div className="text-[10px] text-slate-300">Allocations & Plagiarism Thresholds</div>
                    </div>
                  </Link>
                </div>

                {/* Authentication Actions */}
                <div className="border-t border-white/10 pt-1">
                  {user ? (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/15"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-1 p-1">
                      <Link
                        to="/login"
                        onClick={() => setProfileMenuOpen(false)}
                        className="rounded-lg bg-white/10 py-1.5 text-center text-xs font-semibold text-white transition hover:bg-white/20"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setProfileMenuOpen(false)}
                        className="rounded-lg bg-[#E9B44C] py-1.5 text-center text-xs font-bold text-[#17302B] transition hover:bg-[#f3c873]"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 transition hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#17302B] px-4 pt-3 pb-6 text-white shadow-2xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => {
                  handleNavClick(e, link.path);
                  setMobileMenuOpen(false);
                }}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-[#E9B44C]">
              Access Workspaces
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <Link
                to="/dashboard/student"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg bg-white/5 p-2 text-center text-xs font-semibold text-white hover:bg-white/15"
              >
                Student
              </Link>
              <Link
                to="/dashboard/supervisor"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg bg-white/5 p-2 text-center text-xs font-semibold text-white hover:bg-white/15"
              >
                Supervisor
              </Link>
              <Link
                to="/dashboard/coordinator"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg bg-white/5 p-2 text-center text-xs font-semibold text-white hover:bg-white/15"
              >
                Coordinator
              </Link>
            </div>
          </div>

          <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 rounded-xl border border-white/20 py-2.5 text-center text-xs font-semibold text-white hover:bg-white/10"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 rounded-xl bg-[#E9B44C] py-2.5 text-center text-xs font-bold text-[#17302B] hover:bg-[#f3c873]"
            >
              Student Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
