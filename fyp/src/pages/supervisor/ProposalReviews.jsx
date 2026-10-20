import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";
import { getMyProjects, submitSupervisorDecision } from "../../services/api";

export default function ProposalReviews() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProposal, setActiveProposal] = useState(null);
  const [feedbackInput, setFeedbackInput] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    loadProposals();
  }, []);

  async function loadProposals() {
    try {
      setLoading(true);
      const data = await getMyProjects();
      setProposals(data || []);
    } catch (err) {
      console.error("Failed to load supervisor proposals:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleEndorse = async (id) => {
    try {
      const remark = feedbackInput.trim() || "Proposal endorsed by supervisor. Ready for coordinator approval.";
      await submitSupervisorDecision(id, "Approved by Supervisor", remark);
      addToast("Proposal endorsed and decision recorded in database.");
      setActiveProposal(null);
      setFeedbackInput("");
      await loadProposals();
    } catch (err) {
      addToast(err.message || "Failed to submit decision.", "error");
    }
  };

  const handleRequestRevision = async (id) => {
    if (!feedbackInput.trim()) {
      addToast("Please provide revision remarks for the students.", "warning");
      return;
    }
    try {
      await submitSupervisorDecision(id, "Changes Requested", feedbackInput);
      addToast("Revision remarks recorded and sent to the student group.");
      setActiveProposal(null);
      setFeedbackInput("");
      await loadProposals();
    } catch (err) {
      addToast(err.message || "Failed to submit revision request.", "error");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Proposal Reviews"
        description="Review assigned student proposals, check originality ratings, and record endorsement or revision instructions."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            {proposals.filter((p) => p.status === "Submitted" || p.status === "Under Review").length} Pending Review
          </span>
        }
      />

      {/* Screen Info Banner */}
      <div
        className="rounded-[16px] p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
        style={{ backgroundColor: "#17302A" }}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#EBB44B] text-[#17302A] font-bold text-[16px] flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <div className="font-bold text-[15px] text-white">
              Originality Check Active
            </div>
            <div className="text-[13px] text-[#D5E3DD]">
              All submissions are cross-checked against 10+ years of department archives to prevent duplicate topics.
            </div>
          </div>
        </div>
        <span className="text-[12px] font-bold text-[#EBB44B] bg-[#EBB44B]/15 border border-[#EBB44B]/30 px-3 py-1 rounded-full whitespace-nowrap">
          Screening Passed
        </span>
      </div>

      {/* Proposals List */}
      <div className="space-y-6">
        {proposals.length === 0 ? (
          <div className="card-base text-center py-12 text-[#5F6B66]">
            <div className="text-[16px] font-semibold text-[#17302A]">No proposals currently assigned</div>
            <p className="text-[13px] mt-1">
              When the coordinator assigns student groups to you, their proposals will appear here for review.
            </p>
          </div>
        ) : (
          proposals.map((p) => (
            <Card key={p.id} className="p-6 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#EEEEEA]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[12px] font-bold px-2.5 py-0.5 rounded bg-[#17302A] text-white">
                      {p.group_name}
                    </span>
                    <Badge
                      variant={
                        p.status === "Approved by Supervisor" || p.status === "Approved"
                          ? "green"
                          : p.status === "Changes Requested"
                          ? "amber"
                          : "blue"
                      }
                      size="sm"
                    >
                      {p.status}
                    </Badge>
                  </div>
                  <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                    {p.title}
                  </h3>
                  <div className="text-[13px] text-[#5F6B66] mt-1">
                    Lead: {p.student_name} &middot; Domain: {p.domain} &middot; Version: {p.version} &middot; Submitted: {new Date(p.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[12px] font-bold px-2.5 py-1 rounded-full bg-[#E1F4EA] text-[#0B5A3E] border border-[#C5E8D6]">
                    {p.originality_score}% Novelty
                  </span>
                </div>
              </div>

              {/* Abstract */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A948F] mb-1">Abstract</div>
                <p className="text-[14px] text-[#17302A] leading-relaxed">{p.abstract}</p>
              </div>

              {/* Tech + Group Members */}
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

              {/* Actions */}
              <div className="pt-3 border-t border-[#EEEEEA]">
                {activeProposal === p.id ? (
                  <div className="space-y-3">
                    <textarea
                      className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6] resize-none"
                      rows={3}
                      placeholder="Write feedback, recommendations, or revision notes for the student group..."
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEndorse(p.id)}
                        className="px-4 py-2 rounded-[8px] bg-[#0B5A3E] hover:bg-[#094731] text-white text-[12px] font-bold cursor-pointer transition-colors"
                      >
                        Approve Proposal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRequestRevision(p.id)}
                        className="px-4 py-2 rounded-[8px] bg-red-100 hover:bg-red-200 text-red-800 text-[12px] font-bold cursor-pointer transition-colors"
                      >
                        Request Changes / Revision
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveProposal(null);
                          setFeedbackInput("");
                        }}
                        className="px-4 py-2 rounded-[8px] bg-[#ECECE8] hover:bg-[#E0E0DA] text-[#4A5651] text-[12px] font-bold cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveProposal(p.id)}
                    className="px-4 py-2 rounded-[8px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] text-[13px] font-bold cursor-pointer transition-colors"
                  >
                    Review &amp; Record Decision
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
