import { useState, useMemo } from "react";
import { sampleSupervisors } from "../../data/mockData";

export default function SupervisorSkillsSection() {
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Collect unique skills across all supervisors
  const allSkills = useMemo(() => {
    const set = new Set();
    sampleSupervisors.forEach((s) => {
      s.skills.forEach((skill) => set.add(skill));
    });
    return ["All", ...Array.from(set).slice(0, 10)];
  }, []);

  const filteredSupervisors = useMemo(() => {
    if (selectedSkill === "All") return sampleSupervisors;
    return sampleSupervisors.filter((s) =>
      s.skills.some((skill) => skill.toLowerCase() === selectedSkill.toLowerCase())
    );
  }, [selectedSkill]);

  return (
    <section id="supervisors" className="relative bg-[#122420] py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E9B44C]/40 bg-[#E9B44C]/10 px-3.5 py-1 text-xs font-semibold text-[#E9B44C]">
              Faculty Mentorship Directory
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Faculty Supervisors &amp; Research Skills
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Match with certified university professors and lab directors based on technical skill stacks, machine learning expertise, and current project supervision capacity.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">Supervision rounds open for 2026–27</span>
          </div>
        </div>

        {/* Skill Filter Chips */}
        <div className="mt-8 flex items-center gap-1.5 overflow-x-auto pb-2 text-xs">
          <span className="text-slate-400 font-semibold mr-1 shrink-0">Filter by Skill:</span>
          {allSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => setSelectedSkill(skill)}
              className={`cursor-pointer whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition ${
                selectedSkill === skill
                  ? "bg-[#E9B44C] text-[#17302B] font-bold shadow-md shadow-[#E9B44C]/20"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Supervisors Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSupervisors.map((sup) => {
            const slotsLeft = sup.capacity - sup.assignedCount;
            return (
              <div
                key={sup.id}
                className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-[#17302B]/80 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E9B44C]/50 hover:shadow-2xl"
              >
                <div>
                  {/* Top: Avatar, Name, Capacity */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={sup.avatar}
                        alt={sup.name}
                        className="h-14 w-14 rounded-2xl object-cover border-2 border-[#E9B44C]/60 shadow-md"
                      />
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-[#E9B44C] transition-colors">
                          {sup.name}
                        </h3>
                        <p className="text-[11px] font-medium text-emerald-300">
                          {sup.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {sup.department}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Capacity Indicator Pill */}
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-black/25 px-3 py-2 text-xs">
                    <span className="text-slate-400 text-[11px]">FYP Capacity:</span>
                    <span
                      className={`font-semibold text-[11px] ${
                        slotsLeft > 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {sup.assignedCount} of {sup.capacity} Groups Filled ({slotsLeft > 0 ? `${slotsLeft} slot${slotsLeft > 1 ? "s" : ""} left` : "Full"})
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="mt-3 text-xs leading-relaxed text-slate-300 line-clamp-2">
                    {sup.bio}
                  </p>

                  {/* Supervisor Skills Badges (Randomized data) */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E9B44C] block mb-1.5">
                      Technical Skills &amp; Stack:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sup.skills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => setSelectedSkill(skill)}
                          className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-200 transition hover:bg-[#E9B44C] hover:text-[#17302B]"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-400">
                    <span>{sup.publicationsCount} Publications</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSupervisor(sup);
                      setContactSuccess(false);
                    }}
                    className="cursor-pointer rounded-xl bg-white/10 px-3.5 py-1.5 font-semibold text-emerald-300 transition hover:bg-[#E9B44C] hover:text-[#17302B]"
                  >
                    Request Supervision →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supervision Request Modal */}
      {selectedSupervisor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#E9B44C]/40 bg-[#17302B] p-6 text-white shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setSelectedSupervisor(null)}
              className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-slate-300 hover:bg-white/20 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              <img
                src={selectedSupervisor.avatar}
                alt={selectedSupervisor.name}
                className="h-12 w-12 rounded-2xl object-cover border border-[#E9B44C]"
              />
              <div>
                <h3 className="text-lg font-bold text-white">
                  Request Supervision: {selectedSupervisor.name}
                </h3>
                <p className="text-xs text-emerald-300">{selectedSupervisor.title}</p>
              </div>
            </div>

            {contactSuccess ? (
              <div className="mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 p-5 text-center text-emerald-200">
                <div className="text-base font-bold text-emerald-400">
                  Request Dispatched to {selectedSupervisor.name}
                </div>
                <p className="mt-2 text-xs text-slate-300">
                  Your project pitch and email have been placed in the supervisor's review queue. You will receive email notification once reviewed.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedSupervisor(null)}
                  className="mt-4 rounded-xl bg-[#E9B44C] px-5 py-2 text-xs font-bold text-[#17302B]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSuccess(true);
                }}
                className="mt-5 space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Student Group Lead Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Khan"
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-[#E9B44C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Student Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. s.khan@student.university.edu"
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-[#E9B44C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Proposed FYP Title &amp; Brief Pitch
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Briefly state your idea and why it aligns with this supervisor's skills..."
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-[#E9B44C]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSupervisor(null)}
                    className="flex-1 rounded-xl border border-white/20 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#E9B44C] to-[#f4cb76] py-2.5 text-xs font-bold text-[#17302B] hover:brightness-105"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
