import { Link, NavLink, Outlet } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  const dashboards = [
    {
      id: "student",
      name: "Student Workspace",
      path: "/dashboard/student",
      mark: "ST",
      color: "border-emerald-500 text-emerald-400 bg-emerald-500/10",
    },
    {
      id: "supervisor",
      name: "Supervisor Desk",
      path: "/dashboard/supervisor",
      mark: "SV",
      color: "border-amber-500 text-amber-400 bg-amber-500/10",
    },
    {
      id: "coordinator",
      name: "Coordinator Command",
      path: "/dashboard/coordinator",
      mark: "CD",
      color: "border-blue-500 text-blue-400 bg-blue-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#122420] text-slate-100 flex flex-col font-sans">
      {/* Top Sticky Dashboard Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#17302B]/95 backdrop-blur-md shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Left: Brand Logo & Home link */}
          <div className="flex items-center gap-4">
            <Link to="/" className="group flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl border border-[#E9B44C]/50 bg-white/10 p-1 transition group-hover:scale-105">
                <img src={logo} alt="FYPTrack" className="h-full w-full object-contain rounded-lg" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white">
                  FYP<span className="text-[#E9B44C]">Track</span>
                </span>
                <span className="text-[10px] text-emerald-300 font-medium">Workspaces</span>
              </div>
            </Link>

            <div className="hidden sm:block h-6 w-px bg-white/10" />

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Portal Website</span>
            </Link>
          </div>

          {/* Center: Dashboard Role Switcher Tabs (Outlet Route Switchers) */}
          <nav className="flex items-center gap-1 rounded-2xl bg-black/30 p-1 border border-white/10">
            {dashboards.map((dash) => (
              <NavLink
                key={dash.id}
                to={dash.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#E9B44C] text-[#17302B] shadow-md shadow-[#E9B44C]/25"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <span className="text-[10px] font-mono opacity-80">{dash.mark}</span>
                <span className="hidden md:inline">{dash.name}</span>
                <span className="md:hidden capitalize">{dash.id}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right: User Status & Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-white">{user.full_name}</div>
                  <div className="text-[10px] text-[#E9B44C] capitalize">{user.role} role</div>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition"
                  title="Sign out of FYPTrack"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                  Demo Preview
                </span>
                <Link
                  to="/login"
                  className="rounded-lg bg-[#E9B44C] px-3 py-1.5 text-xs font-bold text-[#17302B] hover:bg-[#f7cc74] transition"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container rendering Child Routes via React Router <Outlet /> */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
