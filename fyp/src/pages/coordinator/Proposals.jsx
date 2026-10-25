import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";
import {
  getAllProjects,
  submitCoordinatorDecision,
  getSupervisorsList,
  assignSupervisorToProject,
  getSupervisorRecommendations,
} from "../../services/api";

export default function CoordinatorProposals() {
  const [proposals, setProposals] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [recommendationsByProject, setRecommendationsByProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [activeProposal, setActiveProposal] = useState(null);
  const [decisionNotes, setDecisionNotes] = useState("");
  const [allocatingPropId, setAllocatingPropId] = useState(null);
  const [selectedSupervisors, setSelectedSupervisors] = useState({});
  const { addToast } = useToast();

  useEffect(() => {
    loadProposals();
  }, []);

  async function loadProposals() {
    try {
      setLoading(true);
      const [projData, facData] = await Promise.all([
        getAllProjects().catch(() => []),
        getSupervisorsList().catch(() => []),
      ]);
      setProposals(projData || []);
      setFaculty(facData || []);

      const recMap = {};
      await Promise.all(
        (projData || []).map(async (p) => {
          try {
            const res = await getSupervisorRecommendations(p.id);
            if (res && res.recommendations) {
              recMap[p.id] = res.recommendations;
            }
          } catch {
            // Fallback
          }
        })
      );
      setRecommendationsByProject(recMap);
    } catch (err) {
      console.error("Failed to load coordinator proposals:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAssignSupervisor = async (p, facultyId) => {
    const fac = faculty.find((f) => f.id === parseInt(facultyId));
    if (!fac) {
      addToast("Please select a supervisor.", "error");
      return;
    }
    try {
      await assignSupervisorToProject(p.id, fac.id, fac.name);
      addToast(`${p.group_name} assigned to ${fac.name}!`);
      setAllocatingPropId(null);
      await loadProposals();
    } catch (err) {
      addToast(err.message || "Failed to assign supervisor.", "error");
    }
  };

  const filtered = proposals.filter((p) => {
    if (filter === "All") return true;
    if (filter === "Awaiting Allocation") return !p.supervisor_name;
    if (filter === "Supervisor Allocated") return Boolean(p.supervisor_name);
    if (filter === "Approved by Supervisor") return p.status === "Approved" || p.status === "Approved by Supervisor";
    return true;
  });

  const unallocatedCount = proposals.filter((p) => !p.supervisor_name).length;

  const handleSaveNote = async (id) => {
    try {
      const notes = decisionNotes.trim() || "Reviewed by FYP Coordinator.";
      await submitCoordinatorDecision(id, p.coordinator_status || "Supervisor Allocated", notes);
      addToast("Coordinator remarks recorded on project file.");
      setActiveProposal(null);
      setDecisionNotes("");
      await loadProposals();
    } catch (err) {
      addToast(err.message || "Failed to record coordinator note.", "error");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Student Proposals & Supervisor Oversight"
        description="Department-wide capstone proposals. Verify academic domains and novelty audits, and allocate faculty supervisors to student groups."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            {unallocatedCount} Awaiting Supervisor Allocation
          </span>
        }
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", "Awaiting Allocation", "Supervisor Allocated", "Approved by Supervisor"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-semibold transition-colors cursor-pointer ${
              filter === f
                ? "bg-[#17302A] text-white"
                : "bg-white border border-[#E6E6E1] text-[#5F6B66] hover:bg-[#F4F4F2]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Proposals List */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="card-base text-center py-12 text-[#5F6B66]">
            No proposals found matching this filter.
          </div>
        ) : (
          filtered.map((p) => (
            <Card key={p.id} className="p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[12px] font-bold px-2.5 py-0.5 rounded bg-[#17302A] text-white">
                      {p.group_name}
                    </span>
                    <Badge
                      variant={p.supervisor_name ? "blue" : "amber"}
                      size="sm"
                    >
                      {p.supervisor_name ? `Supervisor: ${p.supervisor_name}` : "Awaiting Supervisor Allocation"}
                    </Badge>
                    <Badge
                      variant={
                        p.status === "Approved" || p.status === "Approved by Supervisor"
                          ? "green"
                          : p.status === "Changes Requested"
                          ? "red"
                          : "amber"
                      }
                      size="sm"
                    >
                      {p.status === "Approved" || p.status === "Approved by Supervisor"
                        ? "Approved by Supervisor"
                        : p.status || "Under Review"}
                    </Badge>
                  </div>

                  <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                    {p.title}
                  </h3>
                  <div className="text-[13px] text-[#5F6B66] mt-1">
                    Student Lead: {p.student_name} &middot; Domain: {p.domain} &middot; Submitted: {new Date(p.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[12px] font-bold px-3 py-1 rounded-full bg-[#E1F4EA] text-[#0B5A3E] border border-[#C5E8D6]">
                    {p.originality_score}% Originality Score
                  </span>
                </div>
              </div>

              {/* Abstract */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A948F] mb-1">Abstract</div>
                <p className="text-[14px] text-[#17302A] leading-relaxed">{p.abstract}</p>
              </div>

              {/* Technologies & Group Members */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#EEEEEA]">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A948F] mb-1">Technologies</div>
                  <div className="text-[13px] text-[#17302A] font-medium">{p.technologies || "Standard stack"}</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#EEEEEA]">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A948F] mb-1">Group Members</div>
                  <div className="text-[13px] text-[#17302A] font-medium">{p.group_members || p.student_name}</div>
                </div>
              </div>

              {/* Coordinator Notes */}
              {p.coordinator_notes && (
                <div className="p-3.5 rounded-lg bg-[#F8F9F8] border border-[#EEEEEA] text-[13px] text-[#17302A]">
                  <span className="font-bold text-[#17302A]">Coordinator Remarks: </span>
                  {p.coordinator_notes}
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEEEA]">
                <div className="text-[12px] text-[#5F6B66]">
                  Supervisor Decision:{" "}
                  <strong className={p.status === "Approved" || p.status === "Approved by Supervisor" ? "text-[#0B5A3E]" : "text-[#17302A]"}>
                    {p.status === "Approved" || p.status === "Approved by Supervisor" ? "Approved by Supervisor" : p.status || "Pending"}
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAllocatingPropId(allocatingPropId === p.id ? null : p.id)}
                    className="rounded-[8px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] text-[12px] font-bold px-3.5 py-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    {allocatingPropId === p.id ? "Cancel" : p.supervisor_name ? "Change Supervisor" : "Allocate Supervisor"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveProposal(activeProposal?.id === p.id ? null : p);
                      setDecisionNotes(p.coordinator_notes || "");
                    }}
                    className="rounded-[8px] bg-[#17302A] hover:bg-[#23483F] text-white text-[12px] font-bold px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    {activeProposal?.id === p.id ? "Close" : "Add Coordinator Note"}
                  </button>
                </div>
              </div>

              {/* Inline Supervisor Allocation Form */}
              {allocatingPropId === p.id && (
                <div className="mt-3 p-4 rounded-xl bg-[#FFFDF8] border border-[#F3DFAE] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="font-bold text-[14px] text-[#17302A]">
                      {p.supervisor_name ? "Reassign Supervisor" : "Assign Supervisor"} for {p.group_name}
                    </div>
                    {recommendationsByProject[p.id]?.[0] && (
                      <span className="text-[11px] font-bold text-[#0B5A3E] bg-[#E1F4EA] border border-[#B5E2CE] px-2.5 py-0.5 rounded-full">
                        AI Recommended: {recommendationsByProject[p.id][0].name} ({recommendationsByProject[p.id][0].ai_match_score}% Match)
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <select
                      value={selectedSupervisors[p.id] || p.supervisor_id || (faculty[0] ? faculty[0].id : "")}
                      onChange={(e) =>
                        setSelectedSupervisors({
                          ...selectedSupervisors,
                          [p.id]: e.target.value,
                        })
                      }
                      className="w-full sm:w-auto flex-1 rounded-[8px] border border-[#D3D8D4] bg-white px-3 py-2 text-[13px] outline-none font-medium text-[#17302A]"
                    >
                      {faculty.map((f) => {
                        const rec = (recommendationsByProject[p.id] || []).find((r) => r.id === f.id);
                        return (
                          <option key={f.id} value={f.id}>
                            {f.name} ({f.email}) &bull; {rec ? `${rec.ai_match_score}% AI Match` : "Available"} ({f.assigned_count}/5 assigned)
                          </option>
                        );
                      })}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleAssignSupervisor(p, selectedSupervisors[p.id] || p.supervisor_id || faculty[0]?.id)}
                      className="w-full sm:w-auto px-4 py-2 rounded-[8px] bg-[#0B5A3E] hover:bg-[#094731] text-white text-[12px] font-bold cursor-pointer whitespace-nowrap"
                    >
                      Confirm Allocation
                    </button>
                  </div>
                </div>
              )}

              {/* Inline Note Form */}
              {activeProposal?.id === p.id && (
                <div className="mt-3 p-4 rounded-xl bg-[#F8F9F8] border border-[#D3D8D4] space-y-3">
                  <div className="font-bold text-[14px] text-[#17302A]">
                    Coordinator Note for {p.group_name}
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Enter formal departmental guidance or allocation note..."
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    className="w-full rounded-[8px] border border-[#D3D8D4] bg-white p-2.5 text-[13px] outline-none resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveNote(p.id)}
                      className="px-4 py-2 rounded-[8px] bg-[#17302A] hover:bg-[#23483F] text-white text-[12px] font-bold cursor-pointer"
                    >
                      Save Note
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveProposal(null)}
                      className="px-4 py-2 rounded-[8px] bg-[#ECECE8] text-[#4A5651] text-[12px] font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
