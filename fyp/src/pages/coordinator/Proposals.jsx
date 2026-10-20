import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";
import { getAllProjects, submitCoordinatorDecision } from "../../services/api";

export default function CoordinatorProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [activeProposal, setActiveProposal] = useState(null);
  const [decisionNotes, setDecisionNotes] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    loadProposals();
  }, []);

  async function loadProposals() {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProposals(data || []);
    } catch (err) {
      console.error("Failed to load coordinator proposals:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = proposals.filter((p) => {
    if (filter === "All") return true;
    if (filter === "Pending Decision") return p.coordinator_status === "Pending Decision";
    if (filter === "Approved") return p.coordinator_status.includes("Approved");
    if (filter === "Flagged") return p.coordinator_status.includes("Revision") || p.coordinator_status.includes("Rejected");
    return true;
  });

  const handleDecision = async (id, newStatus) => {
    try {
      const notes = decisionNotes.trim() || `Marked as ${newStatus} by Coordinator.`;
      await submitCoordinatorDecision(id, newStatus, notes);
      addToast(`Proposal status updated to: ${newStatus}`);
      setActiveProposal(null);
      setDecisionNotes("");
      await loadProposals();
    } catch (err) {
      addToast(err.message || "Failed to record coordinator decision.", "error");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Proposal Decisions & Governance"
        description="Official institutional review board. Ratify supervisor endorsements, review originality audits, and issue binding approval decisions."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            {proposals.filter((p) => p.coordinator_status === "Pending Decision").length} Awaiting Final Decision
          </span>
        }
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", "Pending Decision", "Approved", "Flagged"].map((f) => (
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
                      variant={
                        p.coordinator_status.includes("Approved")
                          ? "green"
                          : p.coordinator_status.includes("Revision")
                          ? "amber"
                          : "blue"
                      }
                      size="sm"
                    >
                      {p.coordinator_status}
                    </Badge>
                    <span className="text-[12px] font-semibold px-2 py-0.5 rounded bg-[#FAFAF8] text-[#5F6B66] border border-[#EEEEEA]">
                      Supervisor: {p.supervisor_name || "Unassigned"}
                    </span>
                  </div>

                  <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                    {p.title}
                  </h3>
                  <div className="text-[13px] text-[#5F6B66] mt-1">
                    Student: {p.student_name} ({p.student_email}) &middot; Domain: {p.domain} &middot; Submitted: {new Date(p.created_at).toLocaleDateString()}
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

              {/* Decision Notes */}
              {p.coordinator_notes && (
                <div className="p-3.5 rounded-lg bg-[#F8F9F8] border border-[#EEEEEA] text-[13px] text-[#17302A]">
                  <span className="font-bold text-[#17302A]">Official Decision Notes: </span>
                  {p.coordinator_notes}
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEEEA]">
                <div className="text-[12px] text-[#5F6B66]">
                  Status: <span className="font-bold text-[#17302A]">{p.status}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveProposal(p);
                      setDecisionNotes(p.coordinator_notes || "");
                    }}
                    className="rounded-[8px] bg-[#17302A] hover:bg-[#23483F] text-white text-[12px] font-bold px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    Enter Decision
                  </button>
                </div>
              </div>

              {/* Inline Decision Form */}
              {activeProposal?.id === p.id && (
                <div className="mt-3 p-4 rounded-xl bg-[#F8F9F8] border border-[#D3D8D4] space-y-3">
                  <div className="font-bold text-[14px] text-[#17302A]">
                    Official Decision for {p.group_name}
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Enter formal institutional remarks and guidance for the student and supervisor..."
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    className="w-full rounded-[8px] border border-[#D3D8D4] bg-white p-2.5 text-[13px] outline-none resize-none"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDecision(p.id, "Approved by Coordinator")}
                      className="px-4 py-2 rounded-[8px] bg-[#0B5A3E] hover:bg-[#094731] text-white text-[12px] font-bold cursor-pointer"
                    >
                      Approve Proposal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision(p.id, "Changes Requested by Coordinator")}
                      className="px-4 py-2 rounded-[8px] bg-amber-100 hover:bg-amber-200 text-amber-900 text-[12px] font-bold cursor-pointer"
                    >
                      Require Scope Revision
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision(p.id, "Rejected")}
                      className="px-4 py-2 rounded-[8px] bg-red-100 hover:bg-red-200 text-red-800 text-[12px] font-bold cursor-pointer"
                    >
                      Reject Proposal
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
