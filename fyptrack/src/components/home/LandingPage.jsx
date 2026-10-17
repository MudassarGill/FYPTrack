import Navbar from "../layout/Navbar";
import HeroSection from "./HeroSection";
import MainThreeBoxes from "./MainThreeBoxes";
import PreviousProjectsSection from "./PreviousProjectsSection";
import SimilarityLabSection from "./SimilarityLabSection";
import SupervisorSkillsSection from "./SupervisorSkillsSection";
import ProcessFlowSection from "./ProcessFlowSection";
import Footer from "../layout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#17302B] text-slate-100 flex flex-col font-sans selection:bg-[#E9B44C] selection:text-[#17302B]">
      {/* Sticky Navbar with Side Logo, Hover underline effect, and Profile menu */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Live KPI, Headline, and AI preview */}
        <HeroSection />

        {/* Main Three Boxes (Student, Supervisor, Coordinator) */}
        <MainThreeBoxes />

        {/* Previous Student Projects Archive with Similarity Scores */}
        <PreviousProjectsSection />

        {/* Live Interactive AI Similarity Scanner */}
        <SimilarityLabSection />

        {/* Faculty Supervisors Directory with Randomized Skills */}
        <SupervisorSkillsSection />

        {/* Project Lifecycle Roadmap */}
        <ProcessFlowSection />
      </main>

      {/* University Footer with Email Subscription Box */}
      <Footer />
    </div>
  );
}
