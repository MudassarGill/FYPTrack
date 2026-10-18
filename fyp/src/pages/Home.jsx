import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import Card from "../components/shared/Card";
import SectionHeading from "../components/shared/SectionHeading";
import {
  homeStats,
  homeFeatures,
  homeRoles,
  homeSteps,
  homeFAQ,
} from "../data/mock";

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#17302A] flex flex-col font-['Figtree']">
      {/* Navbar */}
      <Navbar mode="public" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#17302A] to-[#24493F] text-white pt-20 pb-28 lg:pt-28 lg:pb-36">
        {/* Subtle decorative radial grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#CFE0D9] text-xs font-semibold uppercase tracking-widest mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#EBB44B]" />
            Intelligent FYP Management & Automation
          </div>

          <h1 className="font-['Bricolage_Grotesque'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
            Manage your Final Year Project with clarity, speed and rigor.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#CFE0D9] max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            A unified platform connecting students, supervisors, and coordinators.
            From proposal defense to milestone evaluations and AI supervisor matching.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/student/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-sm sm:text-base transition-colors shadow-lg shadow-black/10 text-center"
            >
              Explore Student Portal
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base border border-white/20 transition-colors text-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {homeStats.map((st, i) => (
            <Card
              key={i}
              className="p-6 text-center bg-white border border-[#E6E6E1]"
            >
              <div className="font-['Bricolage_Grotesque'] text-2xl sm:text-3xl font-extrabold text-[#17302A] tracking-tight">
                {st.big}
              </div>
              <p className="mt-2 text-xs sm:text-sm text-[#5F6B66] font-medium leading-snug">
                {st.text}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="System Capabilities"
            title="Engineered for University FYP Excellence"
            subtitle="Everything required to organize, track, and evaluate undergraduate capstone projects without messy email threads or lost files."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeFeatures.map((feat, idx) => (
              <Card
                key={idx}
                className="overflow-hidden flex flex-col justify-between bg-white border border-[#E6E6E1]"
              >
                <div>
                  <div className="feature-img-wrap h-44 bg-gradient-to-br from-[#17302A] to-[#24493F] flex items-center justify-center p-6 relative">
                    <div className="text-center">
                      <span className="font-['Bricolage_Grotesque'] text-5xl font-black text-white/15">
                        0{idx + 1}
                      </span>
                      <p className="font-['Bricolage_Grotesque'] text-lg font-bold text-white mt-1">
                        {feat.title}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#17302A] mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-[#5F6B66] leading-relaxed">
                      {feat.text}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-2">
                  <span className="text-xs font-bold text-[#17302A] tracking-wider uppercase group-hover:text-[#F59E0B]">
                    Active Module
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: With vs Without FYPTrack */}
      <section className="py-20 bg-white border-y border-[#E6E6E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="The Transformation"
            title="The Impact on Academic Quality"
            subtitle="See how structured management replaces manual confusion with clear milestones and accountable records."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Without FYPTrack: Plain white card, no red, using CSS dashes */}
            <div className="bg-white rounded-2xl p-8 border border-[#E6E6E1] shadow-sm">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#5F6B66] bg-[#ECECE8] rounded-full mb-4">
                Without FYPTrack
              </span>
              <h3 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-[#17302A] mb-6">
                Manual FYP Coordination
              </h3>
              <ul className="space-y-4 text-sm text-[#5F6B66]">
                <li className="css-dash">
                  Scattered email threads and missed milestone submissions
                </li>
                <li className="css-dash">
                  Unbalanced supervisor student allocations and overload
                </li>
                <li className="css-dash">
                  Unchecked duplicate proposals across different academic years
                </li>
                <li className="css-dash">
                  Lost feedback records when preparing defense presentations
                </li>
                <li className="css-dash">
                  Manual spreadsheet calculations for final grade submissions
                </li>
              </ul>
            </div>

            {/* With FYPTrack: Highlight card with css-check */}
            <div className="bg-[#17302A] text-white rounded-2xl p-8 border border-[#17302A] shadow-xl">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#17302A] bg-[#EBB44B] rounded-full mb-4">
                With FYPTrack
              </span>
              <h3 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-white mb-6">
                Automated FYP Platform
              </h3>
              <ul className="space-y-4 text-sm text-[#CFE0D9]">
                <li className="css-check">
                  Clear deadlines with automated notifications and reminders
                </li>
                <li className="css-check">
                  AI supervisor matching balancing domain fit and slot limits
                </li>
                <li className="css-check">
                  Similarity checking to uphold academic standards and rigor
                </li>
                <li className="css-check">
                  Structured supervisor feedback attached to each deliverable
                </li>
                <li className="css-check">
                  Real-time milestone tracking with weighted marks and audits
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section id="roles" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Role Architecture"
            title="Dedicated Portals for Every Stakeholder"
            subtitle="Tailored interfaces providing appropriate privileges, review workflows, and metrics."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeRoles.map((role, idx) => {
              const isDark = role.variant === "dark";
              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1.5 ${
                    isDark
                      ? "bg-[#17302A] text-white shadow-xl"
                      : "bg-white text-[#17302A] border border-[#E6E6E1] shadow-md"
                  }`}
                >
                  <span
                    className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-4 ${
                      isDark
                        ? "bg-[#EBB44B] text-[#17302A]"
                        : "bg-[#FEF3D6] text-[#6B4700]"
                    }`}
                  >
                    Portal 0{idx + 1}
                  </span>
                  <h3
                    className={`font-['Bricolage_Grotesque'] text-2xl font-extrabold mb-6 ${
                      isDark ? "text-white" : "text-[#17302A]"
                    }`}
                  >
                    {role.title}
                  </h3>
                  <ul className="space-y-4 text-sm">
                    {role.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className={
                          isDark
                            ? "css-check text-[#CFE0D9]"
                            : "css-check css-check-dark text-[#5F6B66]"
                        }
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (Steps) */}
      <section id="workflow" className="py-24 bg-white border-y border-[#E6E6E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Standard Process"
            title="Four Steps to Project Completion"
            subtitle="A systematic pathway guaranteeing timely progress and university policy adherence."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeSteps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-[#FEF3D6] text-[#17302A] font-['Bricolage_Grotesque'] text-2xl font-black flex items-center justify-center mb-6">
                  {step.num}
                </div>
                <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#17302A] mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[#5F6B66] leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Common Questions"
            title="Frequently Asked Questions"
            subtitle="Important information regarding account access, evaluation policies, and supervisor allocation."
          />

          <div className="space-y-4">
            {homeFAQ.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-[#E6E6E1] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-['Bricolage_Grotesque'] text-base sm:text-lg font-bold text-[#17302A]">
                      {item.q}
                    </span>
                    <span
                      className={`css-caret text-[#5F6B66] shrink-0 transition-transform ${
                        isOpen ? "open" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-[#5F6B66] leading-relaxed border-t border-[#E6E6E1]/50">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white border-t border-[#E6E6E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#17302A] rounded-3xl p-8 sm:p-12 lg:p-16 text-white text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#17302A] bg-[#EBB44B] rounded-full mb-4">
                Academic Support
              </span>
              <h2 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                Ready to begin your Final Year Project?
              </h2>
              <p className="text-sm sm:text-base text-[#CFE0D9] leading-relaxed mb-8">
                Sign in with your university credentials to submit your proposal,
                check supervisor assignments, and access submission guidelines.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/student/dashboard"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-sm transition-colors shadow-md"
                >
                  Enter Student Portal
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
