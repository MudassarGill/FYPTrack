import { useState, useEffect } from "react";
import { useToast } from "../../components/shared/Toast";
import { getMyProjects, submitProposal } from "../../services/api";

export default function Proposal() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    domain: "Machine Learning",
    abstract: "",
    technologies: "",
    group_members: "",
    fileName: "Proposal_Document.pdf",
  });

  useEffect(() => {
    loadProject();
  }, []);

  async function loadProject() {
    try {
      setLoading(true);
      const data = await getMyProjects();
      if (data && data.length > 0) {
        const p = data[0];
        setProject(p);
        setFormData({
          title: p.title || "",
          domain: p.domain || "Machine Learning",
          abstract: p.abstract || "",
          technologies: p.technologies || "",
          group_members: p.group_members || "",
          fileName: `Proposal_${p.group_name || "FYP"}.pdf`,
        });
      }
    } catch (err) {
      console.error("Failed to load project:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const saved = await submitProposal({
        title: formData.title,
        domain: formData.domain,
        abstract: formData.abstract,
        technologies: formData.technologies,
        group_members: formData.group_members,
      });
      setProject(saved);
      addToast(
        project?.status === "Changes Requested"
          ? "Revised proposal submitted for supervisor review!"
          : "Proposal submitted to coordinator successfully!"
      );
    } catch (err) {
      addToast(err.message || "Failed to submit proposal.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      if (!formData.title) {
        addToast("Please enter at least a project title to save draft.", "info");
        return;
      }
      const saved = await submitProposal({
        title: formData.title,
        domain: formData.domain,
        abstract: formData.abstract,
        technologies: formData.technologies,
        group_members: formData.group_members,
      });
      setProject(saved);
      addToast("Draft proposal saved to database.", "info");
    } catch (err) {
      addToast(err.message || "Failed to save draft.", "error");
    }
  };

  const statusBadgeColor = (status) => {
    if (status === "Approved" || status === "Approved by Coordinator") return "bg-[#E1F4EA] text-[#0B5A3E]";
    if (status === "Changes Requested") return "bg-[#FEE2E2] text-[#991B1B]";
    if (status === "Rejected") return "bg-[#FEE2E2] text-[#991B1B]";
    return "bg-[#FEF3D6] text-[#6B4700]";
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-['Bricolage_Grotesque'] text-[30px] font-bold text-[#17302A] leading-tight">
              My Proposal
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-[12px] font-bold ${statusBadgeColor(
                project?.status || "Draft"
              )}`}
            >
              {project?.status || "Draft"}
            </span>
          </div>
          <p className="text-[14px] text-[#5F6B66] mt-1">
            Submit your project idea. The coordinator allocates a supervisor, and your supervisor guides progress.
          </p>
        </div>
      </div>

      {/* Revision Notice Banner */}
      {project?.status === "Changes Requested" && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3">
          <div className="font-bold text-[14px]">
            Revision Requested: Please review feedback in the Feedback tab, update your proposal fields below, and click &quot;Submit Proposal&quot; to resubmit.
          </div>
        </div>
      )}

      {/* 2fr / 1fr Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Form card (2fr) */}
        <div className="lg:col-span-2 card-base">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Project Title
              </label>
              <input
                type="text"
                required
                placeholder="Enter complete project title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                  Domain
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                >
                  <option value="Machine Learning">Machine Learning &amp; AI</option>
                  <option value="Cloud Computing">Cloud Computing &amp; DevOps</option>
                  <option value="Cybersecurity">Cybersecurity &amp; Forensics</option>
                  <option value="IoT">IoT &amp; Embedded Systems</option>
                  <option value="Full Stack">Full Stack Web &amp; Mobile</option>
                  <option value="Health Tech">Health Tech &amp; Bioinformatics</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                  Core Technologies
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python, React, PyTorch"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Group Members (Names &amp; Roll Numbers)
              </label>
              <input
                type="text"
                placeholder="e.g. Hamza Tariq (FA20-BSE-042), Ayesha Noor"
                value={formData.group_members}
                onChange={(e) => setFormData({ ...formData, group_members: e.target.value })}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Abstract / Description
              </label>
              <textarea
                rows={5}
                required
                placeholder="Describe problem statement, objectives, and proposed methodology..."
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6] resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {submitting ? "Saving..." : project ? "Update & Submit Proposal" : "Submit Proposal"}
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="rounded-[10px] border-[1.5px] border-[#17302A] text-[#17302A] hover:bg-[#17302A] hover:text-white font-bold text-[14px] px-[18px] py-[11px] transition-colors cursor-pointer"
              >
                Save Draft
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Real DB status & Supervisor assignment */}
        <div className="space-y-6">
          {/* Card: Review Status */}
          <div className="card-base">
            <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-4">
              Review Status
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between py-2 border-b border-[#EEEEEA]">
                <div>
                  <div className="text-[14px] font-semibold text-[#17302A]">Proposal Submission</div>
                  <div className="text-[12px] text-[#5F6B66]">
                    {project ? `Version ${project.version}` : "Not submitted yet"}
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                    project ? "bg-[#E1F4EA] text-[#0B5A3E]" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {project ? "Submitted" : "Pending"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#EEEEEA]">
                <div>
                  <div className="text-[14px] font-semibold text-[#17302A]">Originality Verification</div>
                  <div className="text-[12px] text-[#5F6B66]">Institutional database check</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#E1F4EA] text-[#0B5A3E]">
                  {project ? `${project.originality_score}% Novelty` : "94% Clean"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#EEEEEA]">
                <div>
                  <div className="text-[14px] font-semibold text-[#17302A]">Supervisor Endorsement</div>
                  <div className="text-[12px] text-[#5F6B66]">
                    {project?.supervisor_name ? `Reviewed by ${project.supervisor_name}` : "Awaiting supervisor review"}
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${statusBadgeColor(project?.status)}`}>
                  {project?.status || "Pending"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-[14px] font-semibold text-[#17302A]">Coordinator Approval</div>
                  <div className="text-[12px] text-[#5F6B66]">Final programme ratification</div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${statusBadgeColor(project?.coordinator_status)}`}>
                  {project?.coordinator_status || "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Real Assigned Supervisor */}
          <div className="card-base flex flex-col justify-between">
            <div>
              <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-4">
                Assigned Supervisor
              </h3>
              {project?.supervisor_name ? (
                <>
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-[48px] h-[48px] rounded-full bg-[#EBB44B] text-[#17302A] font-['Bricolage_Grotesque'] font-bold text-[18px] flex items-center justify-center shrink-0">
                      {project.supervisor_name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <div className="font-['Bricolage_Grotesque'] font-bold text-[16px] text-[#17302A]">
                        {project.supervisor_name}
                      </div>
                      <div className="text-[12px] text-[#5F6B66]">Faculty Mentor</div>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#5F6B66] leading-relaxed">
                    Assigned by FYP Coordinator for domain guidance and milestone evaluations.
                  </p>
                </>
              ) : (
                <div className="py-4 text-center">
                  <div className="text-[14px] font-semibold text-[#17302A]">No Supervisor Assigned Yet</div>
                  <p className="text-[12px] text-[#5F6B66] mt-1">
                    Once the FYP Coordinator reviews your proposal, a supervisor will be allocated here.
                  </p>
                </div>
              )}
            </div>
            <div className="pt-3 border-t border-[#EEEEEA] mt-4">
              <span className="text-[12px] font-semibold text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-1 rounded-full">
                {project?.supervisor_name ? "Official Mentor Allocated" : "Awaiting Allocation"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
