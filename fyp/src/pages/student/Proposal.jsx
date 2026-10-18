import { useState } from "react";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import PageHeader from "../../components/shared/PageHeader";
import { proposal, supervisor } from "../../data/mock";

export default function Proposal() {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "history" | "new_draft"
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDomain, setDraftDomain] = useState("Machine Learning");
  const [draftAbstract, setDraftAbstract] = useState("");
  const [submittedNotice, setSubmittedNotice] = useState(false);

  function handleDraftSubmit(e) {
    e.preventDefault();
    setSubmittedNotice(true);
    setTimeout(() => setSubmittedNotice(false), 5000);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Project Proposal"
        description="Review proposal evaluation, coordinator decisions, and AI similarity analysis."
        action={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "new_draft" ? "overview" : "new_draft")}
              className="px-4 py-2.5 rounded-xl bg-[#17302A] hover:bg-[#24493F] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              {activeTab === "new_draft" ? "View Active Proposal" : "Submit Addendum / Draft"}
            </button>
          </div>
        }
      />

      {/* Review Progress Stepper */}
      <Card className="p-6">
        <h3 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#5F6B66] mb-6">
          Proposal Approval Lifecycle
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {proposal.review_steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-4 rounded-xl bg-[#F4F4F2] border border-[#E6E6E1]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-[#E1F4EA] text-[#0B5A3E] text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <Badge variant={step.status}>
                  {step.status}
                </Badge>
              </div>
              <p className="font-bold text-sm text-[#17302A]">{step.label}</p>
              <p className="text-xs text-[#5F6B66] mt-1">{step.date}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Addendum / Draft Form (If toggled) */}
      {activeTab === "new_draft" && (
        <Card className="p-6 sm:p-8 border-2 border-[#EBB44B]">
          <h2 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-[#17302A] mb-2">
            Submit Proposal Revision or Addendum
          </h2>
          <p className="text-sm text-[#5F6B66] mb-6">
            Proposals submitted here will undergo an automated similarity audit before reaching the coordinator.
          </p>

          {submittedNotice && (
            <div className="p-4 rounded-xl bg-[#E1F4EA] text-[#0B5A3E] text-sm font-medium mb-6">
              Addendum submitted successfully! The coordinator and supervisor have been notified.
            </div>
          )}

          <form onSubmit={handleDraftSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17302A] mb-2">
                Project Title
              </label>
              <input
                type="text"
                required
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="e.g. Distributed IoT Sensor Grid with Edge AI"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D3D8D4] focus:outline-none focus:border-[#17302A] text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17302A] mb-2">
                  Domain / Specialization
                </label>
                <select
                  value={draftDomain}
                  onChange={(e) => setDraftDomain(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D3D8D4] focus:outline-none focus:border-[#17302A] text-sm bg-white"
                >
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="IoT & Embedded Systems">IoT & Embedded Systems</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17302A] mb-2">
                  Key Technologies (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Python, PyTorch, FastAPI, React"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D3D8D4] focus:outline-none focus:border-[#17302A] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17302A] mb-2">
                Abstract & Objectives
              </label>
              <textarea
                rows={5}
                required
                value={draftAbstract}
                onChange={(e) => setDraftAbstract(e.target.value)}
                placeholder="Provide a comprehensive summary of project problem statement, methodology, and expected outcomes..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#D3D8D4] focus:outline-none focus:border-[#17302A] text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className="px-5 py-2.5 rounded-xl border border-[#E6E6E1] text-xs font-semibold text-[#5F6B66] hover:bg-[#F4F4F2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] text-xs font-bold uppercase tracking-wider"
              >
                Submit for Audit
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Approved Proposal Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E6E6E1]">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5F6B66]">
                  Approved Title
                </span>
                <h2 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-[#17302A] mt-1">
                  {proposal.title}
                </h2>
              </div>
              <Badge variant="approved" size="lg">
                Approved
              </Badge>
            </div>

            <div className="py-6 space-y-6">
              <div>
                <h4 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#17302A] mb-2">
                  Project Abstract
                </h4>
                <p className="text-sm text-[#5F6B66] leading-relaxed">
                  {proposal.abstract}
                </p>
              </div>

              <div>
                <h4 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#17302A] mb-2">
                  Primary Domain
                </h4>
                <p className="text-sm font-semibold text-[#17302A]">{proposal.domain}</p>
              </div>

              <div>
                <h4 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#17302A] mb-2">
                  Target Technologies
                </h4>
                <p className="text-sm text-[#5F6B66]">{proposal.technologies}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E6E6E1] flex flex-wrap justify-between items-center text-xs text-[#5F6B66] gap-2">
              <span>Submitted: {proposal.submitted_at}</span>
              <span>Coordinator Approval: {proposal.reviewed_at}</span>
            </div>
          </Card>
        </div>

        {/* Right Column: AI Similarity & Assigned Supervisor */}
        <div className="space-y-6">
          {/* Similarity Check Card */}
          <Card className="p-6 bg-white border border-[#E6E6E1]">
            <h3 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#17302A] mb-4">
              AI Similarity Audit
            </h3>
            <div className="p-4 rounded-xl bg-[#F4F4F2] mb-4 text-center">
              <div className="font-['Bricolage_Grotesque'] text-4xl font-black text-[#0B5A3E]">
                {proposal.similarity_score}%
              </div>
              <p className="text-xs font-bold text-[#0B5A3E] mt-1">Original Proposal</p>
              <p className="text-[11px] text-[#5F6B66] mt-0.5">Threshold maximum: 20%</p>
            </div>
            <p className="text-xs text-[#5F6B66] leading-relaxed">
              Comparison against institutional repository completed on Sep 21, 2026.
              No duplicate project overlap found.
            </p>
          </Card>

          {/* Supervisor Card */}
          <Card className="p-6">
            <h3 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#17302A] mb-4">
              Assigned Supervisor
            </h3>
            <div className="space-y-2 text-xs">
              <p className="font-bold text-sm text-[#17302A]">{supervisor.full_name}</p>
              <p className="text-[#5F6B66]">{supervisor.department}</p>
              <p className="text-[#5F6B66]">Domain: {supervisor.specialization}</p>
              <div className="p-3 rounded-lg bg-[#FEF3D6] text-[#6B4700] font-semibold mt-3">
                Topic Fit Match: {supervisor.topic_match}%
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
