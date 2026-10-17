import { useState } from "react";
import { sampleSupervisors } from "../../data/mockData";

export default function SupervisorDashboardView() {
  const [supervisor, setSupervisor] = useState(sampleSupervisors[0]); // Dr. Sarah Jenkins
  const [newSkill, setNewSkill] = useState("");
  const [groups, setGroups] = useState([
    {
      id: "grp-1",
      groupCode: "Group 08",
      title: "Federated Learning Framework for Multi-Hospital Diagnostics",
      students: ["Amina Noor", "Farhan Saeed"],
      milestone: "Sprint 2 Evaluation",
      similarityScore: 11,
      similarityStatus: "safe",
      status: "Submitted (Awaiting Grading)",
      deadline: "Nov 28, 2026",
    },
    {
      id: "grp-2",
      groupCode: "Group 14",
      title: "Deep Vision Pothole & Road Distress Detection with Geo-Tagging",
      students: ["Adnan Baig", "Kamran Yousaf"],
      milestone: "Sprint 1 Prototype",
      similarityScore: 16,
      similarityStatus: "safe",
      status: "Approved",
      deadline: "Completed",
    },
    {
      id: "grp-3",
      groupCode: "Group 22",
      title: "Smart Solar Microgrid Energy Telemetry & Prediction via LoRaWAN",
      students: ["Usman Ali", "Khadija Bibi", "Saad Rauf"],
      milestone: "Architecture & Schema Defense",
      similarityScore: 8,
      similarityStatus: "safe",
      status: "Approved",
      deadline: "Completed",
    },
  ]);

  const [pendingProposals, setPendingProposals] = useState([
    {
      id: "prop-1",
      group: "Group 31",
      students: "Zainab Raza, Tariq Mehmood",
      title: "Real-time Retinal Vessel Segmentation with Attention UNet",
      similarity: 12,
      field: "Biomedical Computer Vision",
    },
  ]);

  const [gradingModalGroup, setGradingModalGroup] = useState(null);
  const [gradeScore, setGradeScore] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState("");
  const [gradeSuccess, setGradeSuccess] = useState("");

  // Add / Remove Supervisor Skills
  function handleAddSkill(e) {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const trimmed = newSkill.trim();
    if (supervisor.skills.includes(trimmed)) return;
    setSupervisor((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setNewSkill("");
  }

  function handleRemoveSkill(skillToRemove) {
    setSupervisor((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  }

  function handleApproveProposal(proposalId) {
    setPendingProposals((prev) => prev.filter((p) => p.id !== proposalId));
  }

  function handleSubmitGrade(e) {
    e.preventDefault();
    if (!gradingModalGroup) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === gradingModalGroup.id
          ? { ...g, status: `Approved (${gradeScore}/100)` }
          : g
      )
    );
    setGradeSuccess(`Grade ${gradeScore}/100 recorded for ${gradingModalGroup.groupCode}!`);
    setTimeout(() => {
      setGradeSuccess("");
      setGradingModalGroup(null);
    }, 1500);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner: Faculty Supervisor Header */}
      <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-[#17302B] via-[#1f3e37] to-[#17302B] p-6 shadow-xl sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={supervisor.avatar}
              alt={supervisor.name}
              className="h-16 w-16 rounded-2xl object-cover border-2 border-[#E9B44C] shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#E9B44C]/20 px-3 py-1 text-xs font-bold text-[#E9B44C] border border-[#E9B44C]/30">
                  Supervisor Desk
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300">{supervisor.office}</span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                {supervisor.name}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-300">{supervisor.title} • {supervisor.department}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Supervision Quota
              </span>
              <div className="text-2xl font-black text-[#E9B44C]">
                {groups.length} / {supervisor.capacity}
              </div>
              <span className="text-[10px] text-emerald-300">
                {supervisor.capacity - groups.length} Slots Available
              </span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pending Reviews
              </span>
              <div className="text-2xl font-black text-amber-300">
                {pendingProposals.length}
              </div>
              <span className="text-[10px] text-slate-400">Proposals Queue</span>
            </div>
          </div>
        </div>
      </div>

      {/* Supervisor Research Skills Manager (Interactive Skill Tag Editor) */}
      <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <svg className="h-5 w-5 text-[#E9B44C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Faculty Skills &amp; Domain Expertise
            </h3>
            <p className="text-xs text-slate-400">
              Students and coordinators use these skill tags to match prospective proposals to your laboratory.
            </p>
          </div>

          {/* Add Skill Input */}
          <form onSubmit={handleAddSkill} className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g. YOLOv9, ROS2)..."
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white placeholder-slate-400 outline-none focus:border-[#E9B44C]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#E9B44C] px-3.5 py-1.5 text-xs font-bold text-[#17302B] hover:bg-[#f3c873]"
            >
              + Add Skill
            </button>
          </form>
        </div>

        {/* Current Skills Badges */}
        <div className="mt-5 flex flex-wrap gap-2">
          {supervisor.skills.map((skill) => (
            <div
              key={skill}
              className="group flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:border-[#E9B44C]/50 hover:bg-white/15"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 text-slate-400 hover:text-rose-400 transition"
                title={`Remove ${skill}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Assigned Student Groups Table */}
      <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Assigned Student Research Groups</h3>
            <p className="text-xs text-slate-400">Track sprint deliverables, milestones, and similarity indicators</p>
          </div>
          <span className="text-xs font-semibold text-[#E9B44C]">Active Groups: {groups.length}</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-3">Group Code</th>
                <th className="py-3 px-3">Project Title &amp; Team</th>
                <th className="py-3 px-3">Milestone Phase</th>
                <th className="py-3 px-3">Similarity</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {groups.map((grp) => (
                <tr key={grp.id} className="hover:bg-white/5 transition">
                  <td className="py-3.5 px-3 font-mono font-bold text-[#E9B44C]">
                    {grp.groupCode}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-white max-w-xs sm:max-w-md truncate">
                      {grp.title}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Team: {grp.students.join(", ")}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px]">
                      {grp.milestone}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                        grp.similarityScore < 15
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${grp.similarityScore < 15 ? "bg-emerald-400" : "bg-amber-400"}`} />
                      {grp.similarityScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[11px] font-medium text-emerald-300">
                      {grp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setGradingModalGroup(grp)}
                      className="rounded-lg bg-[#E9B44C] px-3 py-1.5 text-xs font-bold text-[#17302B] hover:bg-[#f3c873] transition"
                    >
                      Grade Milestone
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Proposals Review Queue */}
      {pendingProposals.length > 0 && (
        <div className="rounded-3xl border border-amber-500/30 bg-amber-950/20 p-6 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                Pending Proposal Submissions ({pendingProposals.length})
              </h3>
              <p className="text-xs text-amber-200/80">
                New student project concepts requesting your supervision
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {pendingProposals.map((prop) => (
              <div
                key={prop.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#E9B44C]">{prop.group}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-300">{prop.students}</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
                      {prop.similarity}% Similarity Safe
                    </span>
                  </div>
                  <div className="mt-1 font-semibold text-white text-sm">{prop.title}</div>
                  <div className="text-[11px] text-slate-400">Target Field: {prop.field}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApproveProposal(prop.id)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-500 transition"
                  >
                    Accept Proposal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveProposal(prop.id)}
                    className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 font-semibold text-slate-300 hover:bg-white/10 transition"
                  >
                    Request Edits
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {gradingModalGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-[#E9B44C]/40 bg-[#17302B] p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              Grade Milestone: {gradingModalGroup.groupCode}
            </h3>
            <p className="mt-1 text-xs text-slate-300">{gradingModalGroup.title}</p>

            {gradeSuccess ? (
              <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-4 text-center text-emerald-300 font-bold text-sm">
                {gradeSuccess}
              </div>
            ) : (
              <form onSubmit={handleSubmitGrade} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">
                    Numerical Score (0 – 100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Number(e.target.value))}
                    required
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-sm text-white font-bold outline-none focus:border-[#E9B44C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300">
                    Supervisor Evaluation Remarks
                  </label>
                  <textarea
                    rows={3}
                    value={gradeFeedback}
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    placeholder="Provide constructive feedback for the students..."
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs text-white outline-none focus:border-[#E9B44C]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setGradingModalGroup(null)}
                    className="flex-1 rounded-xl border border-white/20 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#E9B44C] py-2.5 text-xs font-bold text-[#17302B] hover:bg-[#f3c873]"
                  >
                    Record Grade
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
