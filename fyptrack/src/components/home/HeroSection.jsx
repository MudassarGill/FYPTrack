import { useState } from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("similarity");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#17302B] via-[#1b3832] to-[#122420] pt-12 pb-20 text-white lg:pt-16 lg:pb-28">
      {/* Background ambient lighting effects */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-[#E9B44C]/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-10 right-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E9B44C]/40 bg-[#E9B44C]/10 px-4 py-1.5 text-xs font-semibold text-[#E9B44C] backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#E9B44C] animate-ping" />
              <span>Next-Gen Academic Automation</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-300">FastAPI &amp; React 19</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.12]">
              Intelligent Final Year Project{" "}
              <span className="welcome-text inline-block">Management</span> &amp;{" "}
              <span className="text-[#E9B44C]">Automation</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
              Unifying students, faculty supervisors, and university coordinators in a centralized, AI-assisted workspace. Seamlessly verify proposal similarity, monitor milestone deadlines, track deliverables, and grade defenses with complete academic transparency.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#portals"
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E9B44C] to-[#f4cb76] px-6 py-3.5 text-sm font-bold text-[#17302B] shadow-lg shadow-[#E9B44C]/25 transition hover:brightness-105 active:scale-98"
              >
                <span>Explore Workspaces</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </a>

              <a
                href="#similarity-lab"
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 hover:border-white/30"
              >
                <svg className="h-4 w-4 text-[#E9B44C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Test Proposal Similarity</span>
              </a>

              <Link
                to="/signup"
                className="text-xs font-semibold text-emerald-300 hover:text-white underline underline-offset-4 transition"
              >
                New Student? Register here →
              </Link>
            </div>

            {/* Quick Metrics Ticker */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
              <div>
                <div className="text-2xl font-black text-[#E9B44C]">500+</div>
                <div className="text-xs font-medium text-slate-400">Archived FYPs</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400">&lt; 15%</div>
                <div className="text-xs font-medium text-slate-400">Max Similarity Rule</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">98.4%</div>
                <div className="text-xs font-medium text-slate-400">On-Time Milestones</div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#E9B44C]">30+</div>
                <div className="text-xs font-medium text-slate-400">Research Domains</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hero Dashboard Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md rounded-3xl border border-white/20 bg-gradient-to-b from-[#1f3e37] to-[#152e27] p-5 shadow-2xl backdrop-blur-xl">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300">
                    FYPTrack Intelligence Engine
                  </span>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  LIVE SYSTEM
                </span>
              </div>

              {/* Toggle demo tab */}
              <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-black/20 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("similarity")}
                  className={`rounded-lg py-1.5 transition ${
                    activeTab === "similarity"
                      ? "bg-[#E9B44C] text-[#17302B]"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  AI Similarity Radar
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("milestone")}
                  className={`rounded-lg py-1.5 transition ${
                    activeTab === "milestone"
                      ? "bg-[#E9B44C] text-[#17302B]"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Milestone Sprint
                </button>
              </div>

              {/* Tab 1: AI Similarity Scanner */}
              {activeTab === "similarity" ? (
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Submitted Proposal Draft</span>
                      <span className="font-mono text-[10px] text-emerald-300">Hash: #8f92c</span>
                    </div>
                    <div className="mt-1 font-semibold text-sm text-white">
                      "Autonomous Campus Delivery Rover using LiDAR SLAM"
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {["LiDAR", "SLAM", "ROS2", "Robotics"].map((tag) => (
                        <span key={tag} className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-emerald-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Similarity Gauge */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-emerald-300">Calculated Archive Similarity</div>
                        <div className="text-3xl font-black text-emerald-400">6.2%</div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40">
                          APPROVED · SAFE
                        </span>
                        <div className="mt-1 text-[10px] text-slate-400">Under 15% threshold</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/40">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#E9B44C]" style={{ width: "6.2%" }} />
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 p-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Recommended Faculty Match:</span>
                      <span className="font-semibold text-[#E9B44C]">Dr. Marcus Vance</span>
                    </div>
                    <div className="mt-0.5 text-[10px] text-slate-400">
                      Domain: Autonomous Navigation &amp; Robotics (1 slot available)
                    </div>
                  </div>
                </div>
              ) : (
                /* Tab 2: Milestone Sprint */
                <div className="mt-4 space-y-2.5">
                  {[
                    { step: "Proposal Defense", status: "Approved", date: "Sep 15", color: "text-emerald-400 bg-emerald-500/20" },
                    { step: "Architecture Review", status: "Approved", date: "Oct 10", color: "text-emerald-400 bg-emerald-500/20" },
                    { step: "Sprint 1 Prototype", status: "Approved", date: "Nov 02", color: "text-emerald-400 bg-emerald-500/20" },
                    { step: "Sprint 2 Evaluation", status: "In Progress", date: "Dec 15", color: "text-amber-300 bg-amber-500/20" },
                    { step: "Final Defense", status: "Upcoming", date: "Jan 25", color: "text-slate-400 bg-white/10" },
                  ].map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#E9B44C]">0{idx + 1}</span>
                        <span className="font-medium text-white">{m.step}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">{m.date}</span>
                        <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${m.color}`}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Quick Action */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Instant role preview:</span>
                <Link to="/dashboard/student" className="font-bold text-[#E9B44C] hover:underline">
                  Launch Demo Workspace →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
