import { useState, useEffect } from "react";
import { useToast } from "../../components/shared/Toast";
import { getMyProjects, submitProposal, getDepartmentSettings, getCoordinatorsList } from "../../services/api";

export default function Proposal() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState(null);
  const [deptSettings, setDeptSettings] = useState({ max_group_size: 3, allow_student_self_proposal: true });
  const [coordinators, setCoordinators] = useState([]);
  const [selectedCoordinatorId, setSelectedCoordinatorId] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    domain: "Machine Learning",
    department: "BS Software Engineering",
    abstract: "",
    technologies: "",
    group_members: "",
    fileName: "Proposal_Document.pdf",
  });

  useEffect(() => {
    loadProjectAndSettings();
  }, []);

  async function loadProjectAndSettings() {
    try {
      setLoading(true);
      const [data, settings, coords] = await Promise.all([
        getMyProjects().catch(() => []),
        getDepartmentSettings().catch(() => null),
        getCoordinatorsList().catch(() => []),
      ]);
      if (settings) {
        setDeptSettings(settings);
      }
      if (coords && coords.length > 0) {
        setCoordinators(coords);
        setSelectedCoordinatorId(coords[0].id);
      }
      if (data && data.length > 0) {
        const p = data[0];
        setProject(p);
        if (p.coordinator_id) {
          setSelectedCoordinatorId(p.coordinator_id);
        }
        setFormData({
          title: p.title || "",
          domain: p.domain || "Machine Learning",
          department: p.department || "BS Software Engineering",
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
    if (formData.group_members) {
      const count = formData.group_members.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean).length;
      const maxLimit = deptSettings.max_group_size || 3;
      if (count > maxLimit) {
        addToast(`Department policy strictly limits groups to a maximum of ${maxLimit} members. You listed ${count} members.`, "error");
        return;
      }
    }
    try {
      setSubmitting(true);
      const saved = await submitProposal({
        title: formData.title,
        domain: formData.domain,
        department: formData.department,
        abstract: formData.abstract,
        technologies: formData.technologies,
        group_members: formData.group_members,
        coordinator_id: selectedCoordinatorId ? Number(selectedCoordinatorId) : undefined,
      });
      setProject(saved);
      addToast(
        project?.status === "Changes Requested"
          ? "Revised proposal submitted for supervisor review!"
          : "Proposal submitted successfully! Awaiting supervisor allocation."
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
        department: formData.department,
        abstract: formData.abstract,
        technologies: formData.technologies,
        group_members: formData.group_members,
        coordinator_id: selectedCoordinatorId ? Number(selectedCoordinatorId) : undefined,
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                  Academic Department / Degree
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                >
                  <option value="BS Software Engineering">BS Software Engineering</option>
                  <option value="BS Computer Science">BS Computer Science</option>
                  <option value="BS Artificial Intelligence">BS Artificial Intelligence</option>
                  <option value="BS Data Science">BS Data Science</option>
                  <option value="BS Cyber Security">BS Cyber Security</option>
                  <option value="BS Information Technology">BS Information Technology</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                  Project Domain
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

            {coordinators.length > 0 && (
              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                  FYP Programme Coordinator
                </label>
                <select
                  value={selectedCoordinatorId}
                  onChange={(e) => setSelectedCoordinatorId(e.target.value)}
                  className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                >
                  {coordinators.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#5F6B66] mt-1">
                  Your capstone proposal and novelty screening will be submitted directly to this coordinator.
                </p>
              </div>
            )}

            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Group Members (Lead Author Listed First with Roll No.)
              </label>
              <input
                type="text"
                placeholder="e.g. Hassan Ali (FA20-BSE-026), Ayesha Noor (FA20-BSE-058)"
                value={formData.group_members}
                onChange={(e) => setFormData({ ...formData, group_members: e.target.value })}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
              />
              <p className="text-[11px] text-[#5F6B66] mt-1">
                Note: Lead student should be entered first with roll number. Maximum {deptSettings.max_group_size || 3} members per group.
              </p>
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
                <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${project ? "bg-[#E1F4EA] text-[#0B5A3E]" : "bg-gray-100 text-[#5F6B66]"}`}>
                  {project ? `${project.originality_score}% Novelty` : "Pending Submission"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#EEEEEA]">
                <div>
                  <div className="text-[14px] font-semibold text-[#17302A]">Supervisor Allocation</div>
                  <div className="text-[12px] text-[#5F6B66]">Allocated by FYP Coordinator</div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                    project?.supervisor_name
                      ? "bg-[#E3EEF9] text-[#1E3A8A]"
                      : "bg-[#FEF3D6] text-[#6B4700]"
                  }`}
                >
                  {project?.supervisor_name ? `Allocated (${project.supervisor_name})` : "Awaiting Allocation"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-[14px] font-semibold text-[#17302A]">Proposal Decision</div>
                  <div className="text-[12px] text-[#5F6B66]">
                    {project?.supervisor_name
                      ? `Evaluated by supervisor ${project.supervisor_name}`
                      : "Pending supervisor assignment"}
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                    project?.status === "Approved" || project?.status === "Approved by Supervisor"
                      ? "bg-[#E1F4EA] text-[#0B5A3E]"
                      : project?.status === "Changes Requested"
                      ? "bg-[#FBEAE5] text-[#9A3412]"
                      : "bg-[#FEF3D6] text-[#6B4700]"
                  }`}
                >
                  {project?.status === "Approved" || project?.status === "Approved by Supervisor"
                    ? "Approved by Supervisor"
                    : project?.status || "Pending Review"}
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
