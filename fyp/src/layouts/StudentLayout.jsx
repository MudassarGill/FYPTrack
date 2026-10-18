import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import GuidelinesBanner from "../components/shared/GuidelinesBanner";

export default function StudentLayout() {
  const tabs = [
    { label: "Dashboard", href: "/student/dashboard" },
    { label: "Proposal", href: "/student/proposal" },
    { label: "Project", href: "/student/project" },
    { label: "Milestones", href: "/student/milestones" },
    { label: "Documents", href: "/student/documents" },
    { label: "Feedback", href: "/student/feedback" },
    { label: "Notifications", href: "/student/notifications" },
    { label: "Profile", href: "/student/profile" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#17302A] flex flex-col font-['Figtree']">
      {/* Top Navbar */}
      <Navbar mode="student" />

      {/* Secondary Horizontal Portal Sub-Nav for quick tabs on desktop/tablet */}
      <div className="bg-white border-b border-[#E6E6E1] sticky top-16 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
            {tabs.map((tab) => (
              <NavLink
                key={tab.label}
                to={tab.href}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-[#17302A] text-white shadow-xs"
                      : "text-[#5F6B66] hover:text-[#17302A] hover:bg-[#F4F4F2]"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Guidelines Banner (the only red element) */}
        <GuidelinesBanner className="mb-8" />

        {/* Nested page view */}
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
