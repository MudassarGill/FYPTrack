import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { getStoredUser, clearStoredSession } from "../../services/auth";
import fyplogo from "../../assets/fyplogo.png";

export default function Navbar({ mode = "public" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loggedUser = getStoredUser();
  const isCoordinatorPortal =
    mode === "coordinator" || (mode === "auto" && location.pathname.startsWith("/coordinator"));
  const isSupervisorPortal =
    mode === "supervisor" || (mode === "auto" && location.pathname.startsWith("/supervisor"));
  const isStudentPortal =
    mode === "student" || (mode === "auto" && location.pathname.startsWith("/student"));

  function handleLogout() {
    clearStoredSession();
    navigate("/login");
  }

  // Close dropdown on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMoreDropdownOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setMoreDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Smooth scroll handler for public landing page
  function scrollTo(e, id) {
    if (location.pathname === "/") {
      e.preventDefault();
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
      setMobileMenuOpen(false);
    }
  }

  const publicNav = [
    { label: "Home", href: "/", id: "top" },
    { label: "Features", href: "/#features", id: "features" },
    { label: "Roles", href: "/#roles", id: "roles" },
    { label: "How it works", href: "/#how-it-works", id: "how-it-works" },
    { label: "FAQ", href: "/#faq", id: "faq" },
    { label: "Contact", href: "/#contact", id: "contact" },
  ];

  const studentNav = [
    { label: "Dashboard", href: "/student/dashboard" },
    { label: "My Proposal", href: "/student/proposal" },
    { label: "My Project", href: "/student/project" },
    { label: "Milestones", href: "/student/milestones" },
    { label: "Documents", href: "/student/documents" },
  ];

  const supervisorNav = [
    { label: "Overview", href: "/supervisor/overview" },
    { label: "My Students", href: "/supervisor/students" },
    { label: "My Projects", href: "/supervisor/projects" },
    { label: "Proposals", href: "/supervisor/proposals" },
    { label: "Documents", href: "/supervisor/documents" },
  ];

  const coordinatorNav = [
    { label: "Overview", href: "/coordinator/overview" },
    { label: "Proposals", href: "/coordinator/proposals" },
    { label: "Allocations", href: "/coordinator/supervisors" },
    { label: "Similarity", href: "/coordinator/similarity" },
    { label: "Projects", href: "/coordinator/projects" },
  ];

  const isPortal = isStudentPortal || isSupervisorPortal || isCoordinatorPortal;
  const currentNav = isCoordinatorPortal
    ? coordinatorNav
    : isSupervisorPortal
    ? supervisorNav
    : studentNav;

  const portalHome = isCoordinatorPortal
    ? "/coordinator/overview"
    : isSupervisorPortal
    ? "/supervisor/overview"
    : isStudentPortal
    ? "/student/dashboard"
    : "/";

  const defaultInitials = isCoordinatorPortal ? "CD" : isSupervisorPortal ? "SP" : "ST";
  const userInitials = loggedUser?.full_name
    ? loggedUser.full_name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : defaultInitials;

  const notificationsUrl = isCoordinatorPortal
    ? "/coordinator/notifications"
    : isSupervisorPortal
    ? "/supervisor/notifications"
    : "/student/notifications";

  const profileUrl = isCoordinatorPortal
    ? "/coordinator/profile"
    : isSupervisorPortal
    ? "/supervisor/profile"
    : "/student/profile";

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: "#17302A",
        boxShadow: "0 6px 20px rgba(23,48,42,.35)",
        height: "68px",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link
          to={portalHome}
          className="flex items-center gap-2.5 focus:outline-none group"
        >
          <img
            src={fyplogo}
            alt="FYPTrack Logo"
            className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-white/20 group-hover:ring-[#EBB44B] transition-all"
          />
          <span
            className="font-['Bricolage_Grotesque'] text-[20px] font-extrabold text-white tracking-tight"
          >
            FYPTrack
          </span>
        </Link>

        {/* Desktop Navigation (>= 820px) */}
        <nav className="hidden min-[820px]:flex items-center gap-1">
          {!isPortal ? (
            // Public mode links
            publicNav.map((item) => {
              const isActive =
                item.href === "/"
                  ? location.pathname === "/" && !location.hash
                  : location.hash === `#${item.id}`;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={(e) => scrollTo(e, item.id)}
                  className={`nav-link text-[14px] font-medium px-[14px] py-[10px] transition-colors ${
                    isActive ? "text-white font-bold active" : "text-[#CFE0D9] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })
          ) : (
            // Portal (Student or Supervisor) mode links
            <>
              {currentNav.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`nav-link text-[14px] font-medium px-[14px] py-[10px] transition-colors ${
                      isActive ? "text-white font-bold active" : "text-[#CFE0D9] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* "More" dropdown button with CSS chevron */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className="nav-link text-[14px] font-medium px-[14px] py-[10px] text-[#CFE0D9] hover:text-white flex items-center cursor-pointer focus:outline-none"
                >
                  More
                  <span className={`css-caret ${moreDropdownOpen ? "open" : ""}`} />
                </button>

                {/* Dropdown menu */}
                {moreDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 bg-white rounded-[12px] p-[6px] min-w-[200px] z-50 border border-[#E6E6E1]"
                    style={{ boxShadow: "0 24px 48px rgba(23,48,42,.28)" }}
                  >
                    {isCoordinatorPortal ? (
                      <>
                        <Link
                          to="/coordinator/students"
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3.5 py-2 text-[14px] font-medium text-[#17302A] rounded-lg hover:bg-[#F4F4F2] hover:text-[#C2410C] transition-colors"
                        >
                          Students Registry
                        </Link>
                        <Link
                          to="/coordinator/milestones"
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3.5 py-2 text-[14px] font-medium text-[#17302A] rounded-lg hover:bg-[#F4F4F2] hover:text-[#C2410C] transition-colors"
                        >
                          Deadlines & Calendar
                        </Link>
                        <Link
                          to="/coordinator/reports"
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3.5 py-2 text-[14px] font-medium text-[#17302A] rounded-lg hover:bg-[#F4F4F2] hover:text-[#C2410C] transition-colors"
                        >
                          Reports & Analytics
                        </Link>
                        <Link
                          to="/coordinator/notifications"
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3.5 py-2 text-[14px] font-medium text-[#17302A] rounded-lg hover:bg-[#F4F4F2] hover:text-[#C2410C] transition-colors"
                        >
                          Department Memos
                        </Link>
                        <Link
                          to="/coordinator/profile"
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3.5 py-2 text-[14px] font-medium text-[#17302A] rounded-lg hover:bg-[#F4F4F2] hover:text-[#C2410C] transition-colors"
                        >
                          Department Settings
                        </Link>
                      </>
                    ) : isSupervisorPortal ? (
                      <>
                        <Link
                          to="/supervisor/milestones"
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3.5 py-2 text-[14px] font-medium text-[#17302A] rounded-lg hover:bg-[#F4F4F2] hover:text-[#C2410C] transition-colors"
                        >
                          Milestone Reviews
                        </Link>
                        <Link
                          to="/supervisor/evaluations"
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3.5 py-2 text-[14px] font-medium text-[#17302A] rounded-lg hover:bg-[#F4F4F2] hover:text-[#C2410C] transition-colors"
                        >
                          Evaluations
                        </Link>
                        <Link
                          to="/supervisor/feedback"
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3.5 py-2 text-[14px] font-medium text-[#17302A] rounded-lg hover:bg-[#F4F4F2] hover:text-[#C2410C] transition-colors"
                        >
                          Feedback
                        </Link>
                        <Link
                          to="/supervisor/notifications"
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3.5 py-2 text-[14px] font-medium text-[#17302A] rounded-lg hover:bg-[#F4F4F2] hover:text-[#C2410C] transition-colors"
                        >
                          Notifications
                        </Link>
                        <Link
                          to="/supervisor/profile"
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3.5 py-2 text-[14px] font-medium text-[#17302A] rounded-lg hover:bg-[#F4F4F2] hover:text-[#C2410C] transition-colors"
                        >
                          My Profile
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/student/feedback"
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3.5 py-2 text-[14px] font-medium text-[#17302A] rounded-lg hover:bg-[#F4F4F2] hover:text-[#C2410C] transition-colors"
                        >
                          Feedback
                        </Link>
                        <Link
                          to="/student/notifications"
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3.5 py-2 text-[14px] font-medium text-[#17302A] rounded-lg hover:bg-[#F4F4F2] hover:text-[#C2410C] transition-colors"
                        >
                          Notifications
                        </Link>
                        <Link
                          to="/student/profile"
                          onClick={() => setMoreDropdownOpen(false)}
                          className="block px-3.5 py-2 text-[14px] font-medium text-[#17302A] rounded-lg hover:bg-[#F4F4F2] hover:text-[#C2410C] transition-colors"
                        >
                          Profile
                        </Link>
                      </>
                    )}
                    <div className="my-1 border-t border-[#EEEEEA]" />
                    <button
                      type="button"
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-3.5 py-2 text-[14px] font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>

        {/* Desktop Right Actions (>= 820px) */}
        <div className="hidden min-[820px]:flex items-center gap-3">
          {!isPortal ? (
            loggedUser ? (
              <Link
                to={
                  loggedUser.role === "coordinator"
                    ? "/coordinator/overview"
                    : loggedUser.role === "supervisor"
                    ? "/supervisor/overview"
                    : "/student/dashboard"
                }
                className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors shadow-sm"
              >
                Go to portal
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[14px] font-medium text-[#CFE0D9] hover:text-white px-3 py-2 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors"
                >
                  Get started
                </Link>
              </>
            )
          ) : (
            // Portal mode: Bell icon + 38px amber circle with initials
            <div className="flex items-center gap-3">
              <Link
                to={notificationsUrl}
                className="relative p-2 text-[#CFE0D9] hover:text-white transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </Link>
              <Link
                to={profileUrl}
                className="w-[38px] h-[38px] rounded-full bg-[#EBB44B] text-[#17302A] font-['Bricolage_Grotesque'] font-bold text-[14px] flex items-center justify-center transition-transform hover:scale-105 shadow-sm"
                title={loggedUser?.full_name || (isCoordinatorPortal ? "Coordinator Profile" : isSupervisorPortal ? "Supervisor Profile" : "Student Profile")}
              >
                {userInitials}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile / Tablet Menu Button (< 820px) */}
        <div className="min-[820px]:hidden flex items-center gap-2">
          {isPortal && (
            <Link
              to={notificationsUrl}
              className="p-2 text-[#CFE0D9] hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="px-3 py-1.5 rounded-[8px] bg-white/10 hover:bg-white/15 text-white text-[13px] font-bold tracking-wide cursor-pointer focus:outline-none"
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="min-[820px]:hidden border-t border-white/10 px-6 py-4 space-y-2"
          style={{ backgroundColor: "#17302A" }}
        >
          {!isPortal ? (
            <>
              {publicNav.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={(e) => scrollTo(e, item.id)}
                  className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                {loggedUser ? (
                  <Link
                    to={
                      loggedUser.role === "coordinator"
                        ? "/coordinator/overview"
                        : loggedUser.role === "supervisor"
                        ? "/supervisor/overview"
                        : "/student/dashboard"
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center rounded-[10px] bg-[#EBB44B] text-[#17302A] font-bold text-[14px] py-[11px]"
                  >
                    Go to portal
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center rounded-[10px] bg-[#EBB44B] text-[#17302A] font-bold text-[14px] py-[11px]"
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              {currentNav.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              {isCoordinatorPortal ? (
                <>
                  <Link
                    to="/coordinator/students"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                  >
                    Students Registry
                  </Link>
                  <Link
                    to="/coordinator/milestones"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                  >
                    Deadlines & Calendar
                  </Link>
                  <Link
                    to="/coordinator/reports"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                  >
                    Reports & Analytics
                  </Link>
                  <Link
                    to="/coordinator/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                  >
                    Department Memos
                  </Link>
                  <Link
                    to="/coordinator/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                  >
                    Department Settings
                  </Link>
                </>
              ) : isSupervisorPortal ? (
                <>
                  <Link
                    to="/supervisor/milestones"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                  >
                    Milestone Reviews
                  </Link>
                  <Link
                    to="/supervisor/evaluations"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                  >
                    Evaluations
                  </Link>
                  <Link
                    to="/supervisor/feedback"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                  >
                    Feedback
                  </Link>
                  <Link
                    to="/supervisor/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                  >
                    Notifications
                  </Link>
                  <Link
                    to="/supervisor/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                  >
                    My Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/student/feedback"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                  >
                    Feedback
                  </Link>
                  <Link
                    to="/student/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                  >
                    Notifications
                  </Link>
                  <Link
                    to="/student/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-[14px] font-medium text-[#CFE0D9] hover:text-white"
                  >
                    Profile
                  </Link>
                </>
              )}
              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-[14px] font-medium text-amber-300"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
