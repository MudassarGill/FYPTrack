import { useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";

const initialProposals = [
  {
    id: 1,
    title: "Crop Price Prediction and Market Advisory System",
    group: "Group 14",
    leadStudent: "Ayesha Noor",
    members: ["Ayesha Noor", "Hamza Tariq", "Zainab Ali"],
    domain: "Machine Learning & Time-Series",
    supervisor: "Dr. Imran Shah",
    supervisorStatus: "Endorsed",
    coordinatorStatus: "Pending Decision",
    aiSimilarity: "94% Unique",
    similarityModel: "all-MiniLM-L6-v2",
    submissionDate: "14 Oct 2026",
    abstract:
      "A deep learning and time-series model analyzing mandi arrival volumes and meteorological trends to forecast wholesale crop pricing.",
    supervisorNotes:
      "Feasible dataset, clear methodology, strong mathematics background. Fully endorsed.",
    coordinatorNotes: "",
  },
  {
    id: 2,
    title: "Federated Learning for Medical Imaging Privacy",
    group: "Group 33",
    leadStudent: "Usman Tariq",
    members: ["Usman Tariq", "Khadija Bibi"],
    domain: "Healthcare AI & Security",
    supervisor: "Dr. Imran Shah",
    supervisorStatus: "Endorsed",
    coordinatorStatus: "Pending Decision",
    aiSimilarity: "96% Unique",
    similarityModel: "all-MiniLM-L6-v2",
    submissionDate: "18 Oct 2026",
    abstract:
      "Decentralized neural network training across multi-hospital servers for pneumonia detection without raw patient data transfer.",
    supervisorNotes:
      "Meets IEEE security baseline. Recommended for coordinator approval.",
    coordinatorNotes: "",
  },
  {
    id: 3,
    title: "Real-Time Edge Defect Inspection for Textile Looms",
    group: "Group 19",
    leadStudent: "Fahad Mustafa",
    members: ["Fahad Mustafa", "Danish Qureshi"],
    domain: "Computer Vision & Edge Computing",
    supervisor: "Dr. Rabia Qazi",
    supervisorStatus: "Endorsed",
    coordinatorStatus: "Approved",
    aiSimilarity: "89% Unique",
    similarityModel: "all-MiniLM-L6-v2",
    submissionDate: "19 Oct 2026",
    abstract:
      "High-speed edge camera mounted above industrial looms detecting fabric anomalies using quantized YOLOv8 models.",
    supervisorNotes:
      "Hardware latency validated with bench test. Endorsed.",
    coordinatorNotes: "Formally approved by Department FYP Committee.",
  },
  {
    id: 4,
    title: "Blockchain Powered Degree Verification Protocol",
    group: "Group 42",
    leadStudent: "Zubair Ahmad",
    members: ["Zubair Ahmad", "Saad Malik"],
    domain: "Distributed Ledger & Cryptography",
    supervisor: "Dr. Sadia Malik",
    supervisorStatus: "Under Review",
    coordinatorStatus: "Flagged for Similarity",
    aiSimilarity: "76% Flagged",
    similarityModel: "all-MiniLM-L6-v2",
    submissionDate: "17 Oct 2026",
    abstract:
      "Smart contract-based diploma issuance preventing certificate counterfeiting using Ethereum rollups.",
    supervisorNotes:
      "Investigating overlap with 2024 graduate thesis #CS-24-082.",
    coordinatorNotes: "Needs comprehensive similarity clearance before decision.",
  },
];

export default function CoordinatorProposals() {
  const [proposals, setProposals] = useState(initialProposals);
  const [filter, setFilter] = useState("All");
  const [activeProposal, setActiveProposal] = useState(null);
  const [decisionNotes, setDecisionNotes] = useState("");

  const filtered = proposals.filter((p) => {
    if (filter === "All") return true;
    if (filter === "Pending Decision") return p.coordinatorStatus === "Pending Decision";
    if (filter === "Approved") return p.coordinatorStatus === "Approved";
    if (filter === "Flagged") return p.coordinatorStatus.includes("Flagged");
    return true;
  });

  const handleDecision = (id, newStatus) => {
    setProposals(
      proposals.map((p) =>
        p.id === id
          ? {
              ...p,
              coordinatorStatus: newStatus,
              coordinatorNotes: decisionNotes || `Marked as ${newStatus} by Coordinator.`,
            }
          : p
      )
    );
    setActiveProposal(null);
    setDecisionNotes("");
    addToast(`Proposal status updated to: ${newStatus}`);
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Proposal Decisions & Governance"
        description="Official institutional review board. Ratify supervisor endorsements, review originality audits, and issue binding approval decisions."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            {proposals.filter((p) => p.coordinatorStatus === "Pending Decision").length} Awaiting Final Decision
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
      <div className="space-y-4">
        {filtered.map((p) => (
          <Card key={p.id} className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#EEEEEA]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] font-bold px-2.5 py-0.5 rounded bg-[#17302A] text-white">
                    {p.group}
                  </span>
                  <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded bg-[#E1F4EA] text-[#0B5A3E]">
                    {p.domain}
                  </span>
                  <span className="text-[12px] text-[#5F6B66]">Submitted {p.submissionDate}</span>
                </div>
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                  {p.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={p.coordinatorStatus === "Approved" ? "green" : p.coordinatorStatus === "Pending Decision" ? "amber" : "gray"}
                  size="sm"
                >
                  {p.coordinatorStatus}
                </Badge>
              </div>
            </div>

            {/* Abstract */}
            <p className="text-[14px] text-[#5F6B66] leading-relaxed">
              {p.abstract}
            </p>

            {/* Supervisor & AI Similarity Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#FAFAF8] border border-[#EEEEEA] text-[13px]">
              <div>
                <span className="font-semibold text-[#17302A]">Endorsed Supervisor: </span>
                <span className="text-[#0B5A3E] font-medium">{p.supervisor}</span>
              </div>
              <div>
                <span className="font-semibold text-[#17302A]">AI Embeddings Vector: </span>
                <span className={p.aiSimilarity.includes("Flagged") ? "text-red-700 font-bold" : "text-[#0B5A3E] font-bold"}>
                  {p.aiSimilarity}
                </span>
              </div>
              <div>
                <span className="font-semibold text-[#17302A]">Student Lead: </span>
                <span className="text-[#5F6B66]">{p.leadStudent} ({p.members.length} members)</span>
              </div>
            </div>

            {p.supervisorNotes && (
              <div className="text-[13px] text-[#5F6B66]">
                <strong className="text-[#17302A]">Supervisor Endorsement Note: </strong>
                {p.supervisorNotes}
              </div>
            )}

            {p.coordinatorNotes && (
              <div className="p-3 rounded-lg bg-[#E1F4EA] text-[#0B5A3E] text-[13px] font-medium">
                Committee Decision: {p.coordinatorNotes}
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEEEA]">
              <button
                type="button"
                onClick={() => addToast(`Downloading official proposal dossier for ${p.title}...`, "info")}
                className="text-[13px] font-bold text-[#17302A] hover:text-[#C2410C] flex items-center gap-1 cursor-pointer"
              >
                &darr; View Dossier PDF
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveProposal(p);
                    setDecisionNotes(p.coordinatorNotes || "");
                  }}
                  className="rounded-[10px] bg-[#17302A] hover:bg-[#24493F] text-white text-[13px] font-bold px-4 py-2 transition-colors cursor-pointer"
                >
                  Make Official Decision
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Decision Modal */}
      {activeProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-lg w-full shadow-2xl space-y-4 border border-[#E6E6E1]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-0.5 rounded-full">
                  {activeProposal.group}
                </span>
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mt-1">
                  Coordinator Ratification: {activeProposal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveProposal(null)}
                className="text-[#5F6B66] hover:text-[#17302A] text-[20px] font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Official Committee Decision Remarks
              </label>
              <textarea
                rows={3}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                placeholder="State formal approval rationale, requested scope adjustments, or rejection grounds..."
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white p-3 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6] resize-none"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveProposal(null)}
                className="px-4 py-2 rounded-[10px] border border-[#D3D8D4] text-[13px] font-bold text-[#5F6B66] hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDecision(activeProposal.id, "Rejected")}
                className="px-4 py-2 rounded-[10px] bg-red-100 hover:bg-red-200 text-red-800 text-[13px] font-bold transition-colors cursor-pointer"
              >
                Reject Proposal
              </button>
              <button
                type="button"
                onClick={() => handleDecision(activeProposal.id, "Revisions Requested")}
                className="px-4 py-2 rounded-[10px] bg-[#EEEEEA] hover:bg-[#E0E0DC] text-[#17302A] text-[13px] font-bold transition-colors cursor-pointer"
              >
                Request Revisions
              </button>
              <button
                type="button"
                onClick={() => handleDecision(activeProposal.id, "Approved")}
                className="px-4 py-2 rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
              >
                Ratify & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
