import { useState } from "react";
import { sampleStudentWorkspace } from "../../data/mockData";
import { scanProposalAgainstArchive } from "../../utils/similarity";

export default function StudentDashboardView() {
  const [workspace, setWorkspace] = useState(sampleStudentWorkspace);
  const [uploadName, setUploadName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [similarityQuery, setSimilarityQuery] = useState(workspace.projectTitle);
  const [similarityResult, setSimilarityResult] = useState(() =>
    scanProposalAgainstArchive(workspace.projectTitle, workspace.field)
  );

  function handleAddDeliverable(e) {
    e.preventDefault();
    if (!uploadName.trim()) return;
    const newDoc = {
      name: uploadName.endsWith(".pdf") || uploadName.endsWith(".zip") ? uploadName : `${uploadName}.pdf`,
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      uploadedAt: "Just now",
      status: "Submitted (Pending Review)",
    };
    setWorkspace((prev) => ({
      ...prev,
      deliverables: [newDoc, ...prev.deliverables],
    }));
    setUploadName("");
    setUploadSuccess("File uploaded successfully for supervisor review!");
    setTimeout(() => setUploadSuccess(""), 4000);
  }

  function handleCheckSimilarity(e) {
    e.preventDefault();
    const result = scanProposalAgainstArchive(similarityQuery, "A system architecture and prototype testing plan for final year project.");
    setSimilarityResult(result);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner: Project Title & Quick Stats */}
      <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-[#17302B] via-[#1a3832] to-[#17302B] p-6 shadow-xl sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                Student Workspace
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300 font-mono">Academic Year 2026–27</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              {workspace.projectTitle}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-200">
              Field: <span className="text-white font-medium">{workspace.field}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Similarity Score Card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Verified Similarity
              </span>
              <div className="text-2xl font-black text-emerald-400">
                {workspace.similarityScore}%
              </div>
              <span className="text-[10px] text-slate-400">{workspace.similarityVerdict}</span>
            </div>

            {/* Status Pill */}
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Current Phase
              </span>
              <div className="text-sm font-bold text-[#E9B44C]">{workspace.status}</div>
              <span className="text-[10px] text-slate-400">Next Due: {workspace.submissionDeadline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Progress Bar */}
      <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">FYP Milestone Timeline</h3>
            <p className="text-xs text-slate-400">Progress through university milestone checkpoints</p>
          </div>
          <span className="text-xs font-bold text-[#E9B44C]">3 of 5 Completed (60%)</span>
        </div>

        {/* Milestone Steps */}
        <div className="mt-6 grid gap-4 sm:grid-cols-5">
          {workspace.milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`rounded-2xl border p-4 text-xs transition ${
                milestone.status === "completed"
                  ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-200"
                  : milestone.status === "in-progress"
                  ? "border-[#E9B44C]/50 bg-[#E9B44C]/10 text-white ring-1 ring-[#E9B44C]/30"
                  : "border-white/10 bg-white/5 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#E9B44C]">Step 0{milestone.id}</span>
                {milestone.status === "completed" ? (
                  <span className="h-4 w-4 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                ) : milestone.status === "in-progress" ? (
                  <span className="h-2 w-2 rounded-full bg-[#E9B44C] animate-ping" />
                ) : null}
              </div>
              <h4 className="mt-2 font-bold text-white">{milestone.title}</h4>
              <div className="mt-2 text-[10px] text-slate-300">{milestone.date}</div>
              <div className="mt-1 font-semibold text-[11px] text-[#E9B44C]">{milestone.grade}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Deliverables on Left, Supervisor & Similarity on Right */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Deliverables Upload & Documents */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <svg className="h-5 w-5 text-[#E9B44C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Sprint Deliverable
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Submit code packages, architectural diagrams, or progress reports for your supervisor.
            </p>

            {uploadSuccess && (
              <div className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-3 text-xs text-emerald-300">
                {uploadSuccess}
              </div>
            )}

            <form onSubmit={handleAddDeliverable} className="mt-4 flex gap-2">
              <input
                type="text"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                placeholder="e.g. Sprint2_Architecture_Schema.pdf"
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-[#E9B44C]"
              />
              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-[#E9B44C] px-5 py-2.5 text-xs font-bold text-[#17302B] hover:bg-[#f3c873] transition"
              >
                Upload File
              </button>
            </form>

            {/* Deliverables List */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Submitted Documents &amp; Status
              </h4>
              <div className="mt-3 space-y-2">
                {workspace.deliverables.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                        DOC
                      </div>
                      <div>
                        <div className="font-semibold text-white">{doc.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {doc.size} • Uploaded {doc.uploadedAt}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        doc.status.includes("Approved")
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : doc.status.includes("Reviewed")
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supervisor Feedback Timeline */}
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-base font-bold text-white">Supervisor Remarks &amp; Feedback</h3>
            <div className="mt-4 space-y-3">
              {workspace.supervisorFeedback.map((fb, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="font-bold text-[#E9B44C]">{fb.author}</span>
                    <span>{fb.date}</span>
                  </div>
                  <p className="mt-2 text-slate-200 leading-relaxed">{fb.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Assigned Supervisor Card & Quick AI Similarity Checker */}
        <div className="lg:col-span-5 space-y-6">
          {/* Supervisor Profile Card */}
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-base font-bold text-white">Assigned Faculty Mentor</h3>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[#E9B44C]/20 border border-[#E9B44C] flex items-center justify-center text-lg font-bold text-[#E9B44C]">
                SJ
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{workspace.supervisor.name}</h4>
                <p className="text-xs text-slate-300">{workspace.supervisor.department}</p>
                <p className="text-[11px] text-emerald-300">{workspace.supervisor.email}</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Office Hours &amp; Meeting Sync:
              </span>
              <p className="mt-1 text-slate-200 font-medium">
                {workspace.supervisor.officeHours}
              </p>
            </div>
          </div>

          {/* Quick Similarity Pre-Check Tool */}
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quick Similarity Re-scan
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Check amended title or scope against the archive.
            </p>

            <form onSubmit={handleCheckSimilarity} className="mt-4 space-y-2">
              <input
                type="text"
                value={similarityQuery}
                onChange={(e) => setSimilarityQuery(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs text-white outline-none focus:border-[#E9B44C]"
              />
              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl bg-white/10 py-2 text-xs font-semibold text-emerald-300 hover:bg-white/20 transition"
              >
                Run AI Similarity Check
              </button>
            </form>

            <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Similarity Result:</span>
                <span className="text-lg font-bold text-emerald-400">
                  {similarityResult.topScore}%
                </span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-200">
                Status: {similarityResult.statusText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
