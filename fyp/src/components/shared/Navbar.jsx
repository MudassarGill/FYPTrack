import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import logoImg from "../../assets/logo.jpg";
import { currentStudent } from "../../data/mock";
import { getStoredUser, clearStoredSession } from "../../services/auth";

export default function Navbar({ mode = "auto" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isStudentPortal =
    mode === "student" || (mode === "auto" && location.pathname.startsWith("/student"));

  const user = getStoredUser() || currentStudent;

  function handleLogout() {
    clearStoredSession();
    navigate("/login");
  }

  // Scroll to section handler for public links
  function scrollToSection(e, sectionId) {
    // If we're already on the home page, scroll directly
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setMobileMenuOpen(false);
    }
    // If on another page, the Link will navigate to /#section and smooth scroll will handle it
  }

  const publicLinks = [
    { label: "Home", href: "/", sectionId: null },
    { label: "Features", href: "/#features", sectionId: "features" },
    { label: "Roles", href: "/#roles", sectionId: "roles" },
    { label: "Workflow", href: "/#workflow", sectionId: "workflow" },
    { label: "FAQ", href: "/#faq", sectionId: "faq" },
    { label: "Contact", href: "/#contact", sectionId: "contact" },
  ];

  const studentLinks = [
    { label: "Dashboard", href: "/student/dashboard" },
    { label: "Proposal", href: "/student/proposal" },
    { label: "Project", href: "/student/project" },
    { label: "Milestones", href: "/student/milestones" },
    { label: "Documents", href: "/student/documents" },
    { label: "Feedback", href: "/student/feedback" },
  ];

  const links = isStudentPortal ? studentLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 w-full shadow-lg" style={{ backgroundColor: "black" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo - only the image, no text */}
          <Link
            to={isStudentPortal ? "/student/dashboard" : "/"}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 p-0.5 border border-white/20 shadow-sm flex items-center justify-center shrink-0">
              <img
                src={logoImg}
                alt="FYPTrack Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {links.map((link) => {
              const isActive =
                location.pathname === link.href ||
                (link.href !== "/" && location.pathname.startsWith(link.href));

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={(e) => {
                    if (!isStudentPortal && link.sectionId) {
                      scrollToSection(e, link.sectionId);
                    }
                  }}
                  className={`nav-link text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-white active"
                      : "text-[#CFE0D9] hover:text-[#F59E0B]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isStudentPortal ? (
              <>
                {/* Notification Bell */}
                <Link
                  to="/student/notifications"
                  className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#EBB44B] rounded-full border-2 border-[#2f2626]" />
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 transition-colors focus:outline-none border border-white/10"
                  >
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[#2f2626]"
                      style={{ backgroundColor: user?.avatar_color || "#EBB44B" }}
                    >
                      {user?.initials || "ST"}
                    </span>
                    <span className="text-xs font-medium text-white max-w-[110px] truncate">
                      {user?.full_name || "Student"}
                    </span>
                    <span
                      className={`css-caret text-[#CFE0D9] ${
                        userDropdownOpen ? "open" : ""
                      }`}
                    />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl py-2 z-50 border border-[#E6E6E1]"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-[#E6E6E1]">
                        <p className="text-xs font-bold text-[#17302A] truncate">
                          {user?.full_name}
                        </p>
                        <p className="text-[11px] text-[#5F6B66] truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/student/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-medium text-[#17302A] hover:bg-[#F4F4F2] transition-colors"
                      >
                        Student Profile
                      </Link>
                      <Link
                        to="/"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-medium text-[#17302A] hover:bg-[#F4F4F2] transition-colors"
                      >
                        Public Home
                      </Link>
                      <div className="my-1 border-t border-[#E6E6E1]" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-[#5F6B66] hover:bg-[#F4F4F2] transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-white hover:text-[#F59E0B] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {isStudentPortal && (
              <Link
                to="/student/notifications"
                className="relative p-2 rounded-lg bg-white/10 text-white"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#EBB44B] rounded-full" />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`h-0.5 w-full bg-white rounded transition-transform ${
                    mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-white rounded transition-opacity ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-white rounded transition-transform ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* NO animated glow line - removed as requested */}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 px-4 pt-3 pb-6 space-y-2" style={{ backgroundColor: "#2f2626" }}>
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={(e) => {
                if (!isStudentPortal && link.sectionId) {
                  scrollToSection(e, link.sectionId);
                }
                setMobileMenuOpen(false);
              }}
              className="block px-3 py-2 text-sm font-medium rounded-lg text-[#CFE0D9] hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {isStudentPortal ? (
              <>
                <Link
                  to="/student/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg"
                >
                  Profile ({user?.full_name})
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-[#CFE0D9] hover:bg-white/10 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 text-sm font-semibold text-white bg-white/10 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 text-sm font-bold text-[#17302A] bg-[#EBB44B] rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
