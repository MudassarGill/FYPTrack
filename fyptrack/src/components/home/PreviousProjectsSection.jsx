import { useState, useMemo } from "react";
import { samplePreviousProjects } from "../../data/mockData";

export default function PreviousProjectsSection() {
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const domains = useMemo(() => {
    const list = ["All"];
    samplePreviousProjects.forEach((p) => {
      if (p.domain && !list.includes(p.domain)) list.push(p.domain);
    });
    return list;
  }, []);

  const filteredProjects = useMemo(() => {
    return samplePreviousProjects.filter((p) => {
      const matchDomain = selectedDomain === "All" || p.domain === selectedDomain;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.abstract.toLowerCase().includes(q) ||
        p.supervisor.toLowerCase().includes(q) ||
        p.studentNames.some((s) => s.toLowerCase().includes(q)) ||
        p.technologies.some((t) => t.toLowerCase().includes(q));
      return matchDomain && matchSearch;
    });
  }, [selectedDomain, searchQuery]);

  return (
    <section id="projects" className="relative bg-[#122420] py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E9B44C]/40 bg-[#E9B44C]/10 px-3.5 py-1 text-xs font-semibold text-[#E9B44C]">
              University Project Archive
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Previous Student FYP Projects
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Browse approved past final year projects, explore research methodologies, and verify originality benchmarks with verified similarity scores.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9B44C]/20 text-[#E9B44C] font-bold">
              AI
            </div>
            <div>
              <div className="font-bold text-white">Similarity Score Archive</div>
              <div className="text-[11px] text-slate-400">Average originality: 91.8%</div>
            </div>
          </div>
        </div>

        {/* Filter Controls: Search & Category Pills */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, student, tech, supervisor..."
              className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-400 outline-none transition focus:border-[#E9B44C] focus:bg-white/10"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Domain Pills */}
          <div className="flex w-full md:w-auto items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {domains.map((dom) => (
              <button
                key={dom}
                type="button"
                onClick={() => setSelectedDomain(dom)}
                className={`cursor-pointer whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition ${
                  selectedDomain === dom
                    ? "bg-[#E9B44C] text-[#17302B] font-bold shadow-md shadow-[#E9B44C]/20"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const isSafe = project.similarityScore < 15;
            return (
              <div
                key={project.id}
                className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#17302B]/70 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E9B44C]/40 hover:shadow-2xl"
              >
                <div>
                  {/* Top Bar: Field Tag & Similarity Score Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      {project.field}
                    </span>

                    {/* Similarity Score Badge */}
                    <div
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                        isSafe
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      }`}
                      title={`Verified Similarity Index: ${project.similarityScore}%`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isSafe ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                      <span>{project.similarityScore}% Similarity</span>
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="mt-3 text-base font-bold text-white group-hover:text-[#E9B44C] transition-colors leading-snug">
                    {project.title}
                  </h3>

                  {/* Abstract preview */}
                  <p className="mt-2 text-xs leading-relaxed text-slate-300 line-clamp-3">
                    {project.abstract}
                  </p>

                  {/* Tech stack pills */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-black/30 px-1.5 py-0.5 text-[9px] font-mono text-slate-300 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="rounded bg-black/20 px-1.5 py-0.5 text-[9px] text-slate-400">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer details & Action */}
                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Supervisor:</span>
                      <span className="font-semibold text-slate-200">{project.supervisor}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Year:</span>
                      <span className="font-semibold text-[#E9B44C]">{project.year}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="mt-3 w-full cursor-pointer rounded-lg border border-white/15 bg-white/5 py-2 text-center text-xs font-semibold text-emerald-200 transition hover:bg-[#E9B44C] hover:text-[#17302B] hover:border-[#E9B44C]"
                  >
                    View Project Dossier →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
            <p className="text-sm">No archived student projects found matching "{searchQuery}".</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedDomain("All");
              }}
              className="mt-3 text-xs font-semibold text-[#E9B44C] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Modal: Project Dossier */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E9B44C]/40 bg-[#17302B] p-6 text-white shadow-2xl sm:p-8">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-slate-300 hover:bg-white/20 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#E9B44C]/20 px-2 py-0.5 text-xs font-bold text-[#E9B44C]">
                {selectedProject.year}
              </span>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-emerald-300">
                {selectedProject.domain}
              </span>
            </div>

            <h3 className="mt-3 text-xl font-bold sm:text-2xl text-white">
              {selectedProject.title}
            </h3>

            {/* Similarity Score Callout in Modal */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-emerald-400" />
                <span className="text-xs text-slate-300">Archive Similarity Index:</span>
                <span className="text-base font-bold text-emerald-400">
                  {selectedProject.similarityScore}%
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-300">
                Grade: {selectedProject.grade}
              </span>
            </div>

            {/* Abstract */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E9B44C]">
                Abstract &amp; Problem Statement
              </h4>
              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-200">
                {selectedProject.abstract}
              </p>
            </div>

            {/* Methodology */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E9B44C]">
                Methodology &amp; Architecture
              </h4>
              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-300">
                {selectedProject.methodology}
              </p>
            </div>

            {/* Student Team & Supervisor */}
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Student Team:
                </span>
                <ul className="mt-1 space-y-0.5 font-medium text-white">
                  {selectedProject.studentNames.map((name, i) => (
                    <li key={i}>• {name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Faculty Supervisor:
                </span>
                <p className="mt-1 font-semibold text-[#E9B44C]">
                  {selectedProject.supervisor}
                </p>
                {selectedProject.award && (
                  <p className="mt-1 text-[11px] text-amber-300">
                    🏆 {selectedProject.award}
                  </p>
                )}
              </div>
            </div>

            {/* Technologies */}
            <div className="mt-4 border-t border-white/10 pt-3">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Technologies &amp; Libraries:
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-white/10 px-2 py-1 text-xs font-mono text-emerald-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
