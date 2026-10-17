import { Link } from "react-router-dom";

export default function MainThreeBoxes() {
  const boxes = [
    {
      id: "student-portal",
      role: "Student Portal",
      badge: "Self-Service",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      accentColor: "#10b981",
      route: "/dashboard/student",
      icon: (
        <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
      title: "Student Workspace & Submissions",
      description:
        "Manage your final year project from proposal to defense. Pre-check similarity scores, track sprint deadlines, upload weekly deliverables, and receive direct supervisor critique.",
      features: [
        "AI Proposal Similarity Pre-Check tool",
        "Weekly Milestone Sprint Tracker & Deadlines",
        "Multi-format Deliverable File Uploads (PDF/ZIP)",
        "Direct Supervisor Remarks & Meeting Logs",
        "Public Student Registration via FastAPI",
      ],
      cta: "Open Student Dashboard",
      ctaBg: "bg-emerald-600 hover:bg-emerald-500 text-white",
    },
    {
      id: "supervisor-desk",
      role: "Supervisor Workspace",
      badge: "Faculty Mentorship",
      badgeColor: "bg-[#E9B44C]/20 text-[#E9B44C] border-[#E9B44C]/30",
      accentColor: "#E9B44C",
      route: "/dashboard/supervisor",
      icon: (
        <svg className="h-8 w-8 text-[#E9B44C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Faculty Supervisor Desk & Skills",
      description:
        "Review incoming student proposals, showcase faculty research skills and domains, grade sprint deliverables, and mentor student research groups with structured feedback.",
      features: [
        "Manage Research Skills (PyTorch, ROS, Cloud, etc.)",
        "Student Group Proposal Reviews & Approvals",
        "Similarity Alert Warnings on Submissions",
        "Milestone Evaluation & Mid-term Defense Grading",
        "Group Capacity & Supervision Quota Controls",
      ],
      cta: "Open Supervisor Workspace",
      ctaBg: "bg-[#E9B44C] hover:bg-[#f5c974] text-[#17302B]",
    },
    {
      id: "coordinator-hub",
      role: "Coordinator Hub",
      badge: "University Administration",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      accentColor: "#3b82f6",
      route: "/dashboard/coordinator",
      icon: (
        <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "University Coordinator Command",
      description:
        "Complete institutional oversight. Allocate student groups to faculty supervisors, manage plagiarism thresholds, publish defense schedules, and export accreditation reports.",
      features: [
        "Department-Wide FYP Analytics & Metrics",
        "Student-Supervisor Allocation Matrix",
        "High Similarity Violations & Dispute Hearings",
        "Milestone Deadlines & Broadcast Announcements",
        "Accreditation & Batch Report Exports",
      ],
      cta: "Open Coordinator Command",
      ctaBg: "bg-blue-600 hover:bg-blue-500 text-white",
    },
  ];

  return (
    <section id="portals" className="relative bg-[#17302B] py-20 text-white">
      {/* Background divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E9B44C]/30 to-transparent"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E9B44C]/40 bg-[#E9B44C]/10 px-4 py-1 text-xs font-semibold text-[#E9B44C]">
            Three Tailored Workspaces
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Dedicated Portals for the Whole Academic Hierarchy
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            FYPTrack replaces messy spreadsheets and lost emails with purpose-built environments customized for each stakeholder's responsibilities.
          </p>
        </div>

        {/* The Main Three Boxes Grid */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {boxes.map((box) => (
            <div
              key={box.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-7 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E9B44C]/50 hover:shadow-2xl hover:shadow-[#E9B44C]/10"
            >
              {/* Top Accent Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 opacity-80 transition-all duration-300 group-hover:h-2"
                style={{ backgroundColor: box.accentColor }}
              />

              <div>
                {/* Header: Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner transition group-hover:scale-105">
                    {box.icon}
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${box.badgeColor}`}>
                    {box.badge}
                  </span>
                </div>

                {/* Role & Title */}
                <div className="mt-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E9B44C]">
                    {box.role}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-white group-hover:text-[#E9B44C] transition-colors">
                    {box.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300">
                    {box.description}
                  </p>
                </div>

                {/* Features Checklist */}
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Key Capabilities:
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {box.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <svg className="h-4 w-4 shrink-0 text-[#E9B44C] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="mt-8 pt-4 border-t border-white/10">
                <Link
                  to={box.route}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold shadow-md transition active:scale-98 ${box.ctaBg}`}
                >
                  <span>{box.cta}</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
