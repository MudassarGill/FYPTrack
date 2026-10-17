export default function ProcessFlowSection() {
  const steps = [
    {
      number: "01",
      title: "Proposal Submission & AI Similarity Pre-check",
      description:
        "Students register, form groups of 2–3, and draft their project proposal. The automated AI radar checks for duplicate concepts against the 500+ project archive.",
      badge: "Week 1–3",
      accent: "#10b981",
    },
    {
      number: "02",
      title: "Faculty Supervisor Matching & Committee Approval",
      description:
        "Proposals are reviewed based on supervisor technical skills (PyTorch, ROS, Cloud, etc.) and group capacity limits. Coordinators grant formal approval.",
      badge: "Week 4–5",
      accent: "#E9B44C",
    },
    {
      number: "03",
      title: "Agile Sprint Milestones & Mid-Term Defense",
      description:
        "Bi-weekly milestone check-ins where code repositories, architecture diagrams, and working prototypes are evaluated with numerical scoring rubrics.",
      badge: "Week 6–16",
      accent: "#3b82f6",
    },
    {
      number: "04",
      title: "Final Thesis Submission & Viva Defense",
      description:
        "Final PDF thesis, source code, and live prototype demonstration evaluated by external university examiners and department jury.",
      badge: "Week 17–24",
      accent: "#a855f7",
    },
  ];

  return (
    <section id="roadmap" className="relative bg-[#17302B] py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E9B44C]/40 bg-[#E9B44C]/10 px-4 py-1 text-xs font-semibold text-[#E9B44C]">
            Academic Project Lifecycle
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            How FYPTrack Automates the Project Journey
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            A structured, 4-stage automated pipeline guiding academic progress from inception to graduation honors.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E9B44C]/50 hover:bg-white/10"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#E9B44C]">
                    {step.number}
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
                    {step.badge}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-white leading-snug">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/10">
                <div
                  className="h-1 w-12 rounded-full"
                  style={{ backgroundColor: step.accent }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
