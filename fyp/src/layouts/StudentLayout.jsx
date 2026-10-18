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
