import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import GuidelinesBanner from "../components/shared/GuidelinesBanner";

export default function SupervisorLayout() {
  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#17302A] flex flex-col font-['Figtree']">
      {/* 1. Navbar mode="supervisor" */}
      <Navbar mode="supervisor" />

      {/* 2. Main content area */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* 3. Guidelines Banner */}
      <div className="max-w-[1200px] w-full mx-auto px-6 my-8">
        <GuidelinesBanner />
      </div>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
