import { useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";

const initialProposals = [
  {
    id: 1,
    title: "Crop Price Prediction and Market Advisory System",
    group: "Group 14",
    leadStudent: "Ayesha Noor",
    members: ["Ayesha Noor", "Hamza Tariq", "Zainab Ali"],
    domain: "Machine Learning & Time-Series",
    submittedDate: "14 Oct 2026",
    abstract:
      "A deep learning and time-series forecasting model analyzing mandi arrival volumes, seasonal meteorological patterns, and supply chain indicators to project future wholesale crop prices across major agricultural zones.",
    technologies: "Python, FastAPI, TensorFlow, React, PostgreSQL",
    aiSimilarity: {
      score: "94% Unique",
      closestMatch: "Wheat Yield Forecasting (2024, 6% overlap in dataset methodology)",
      model: "all-MiniLM-L6-v2 Embeddings",
    },
    supervisorStatus: "Endorsed",
    coordinatorStatus: "Pending Approval",
    supervisorFeedback: "Strong empirical foundation and viable dataset approach. Ready for coordinator ratification.",
    pdfUrl: "#",
  },
  {
    id: 2,
    title: "Federated Learning for Medical Imaging Privacy",
    group: "Group 33",
    leadStudent: "Usman Tariq",
    members: ["Usman Tariq", "Khadija Bibi"],
    domain: "Healthcare AI & Security",
    submittedDate: "18 Oct 2026",
    abstract:
      "A decentralized neural architecture allowing multiple hospital nodes to train collective pneumonia detection models over DICOM chest scans without ever transmitting raw patient radiographs off-premise.",
    technologies: "PyTorch, Flower FL, FastAPI, Docker",
    aiSimilarity: {
      score: "96% Unique",
      closestMatch: "Distributed Hospital Radiology (2023, 4% lexical similarity)",
      model: "all-MiniLM-L6-v2 Embeddings",
    },
    supervisorStatus: "Under Review",
    coordinatorStatus: "Pending Supervisor Review",
    supervisorFeedback: "",
    pdfUrl: "#",
  },
  {
    id: 3,
    title: "Real-Time Edge Defect Inspection for Textile Looms",
    group: "Group 19",
    leadStudent: "Fahad Mustafa",
    members: ["Fahad Mustafa", "Danish Qureshi"],
    domain: "Computer Vision & Edge Computing",
    submittedDate: "19 Oct 2026",
    abstract:
      "High-speed camera sensor mounted above industrial weaving looms detecting fabric warp anomalies using quantized YOLOv8 running on embedded microcontrollers.",
    technologies: "YOLOv8, C++, OpenCV, Raspberry Pi",
    aiSimilarity: {
      score: "89% Unique",
      closestMatch: "Fabric Flaw Detector (2022, 11% similarity in hardware specs)",
      model: "all-MiniLM-L6-v2 Embeddings",
    },
    supervisorStatus: "Needs Revision",
    coordinatorStatus: "Pending Re-submission",
    supervisorFeedback: "Hardware frame-rate latency needs clearer justification. Revise Section 3 methodology.",
    pdfUrl: "#",
  },
];

export default function ProposalReviews() {
  const [proposals, setProposals] = useState(initialProposals);
  const [activeProposal, setActiveProposal] = useState(null);
  const [feedbackInput, setFeedbackInput] = useState("");

  const handleEndorse = (id) => {
    setProposals(
      proposals.map((p) =>
        p.id === id
          ? {
              ...p,
              supervisorStatus: "Endorsed",
              coordinatorStatus: "Pending Coordinator Approval",
              supervisorFeedback: feedbackInput || "Endorsed by supervisor.",
            }
          : p
      )
    );
    setActiveProposal(null);
    setFeedbackInput("");
    alert("Proposal endorsed and forwarded to FYP Coordinator for final decision!");
  };

  const handleRequestRevision = (id) => {
    if (!feedbackInput.trim()) {
      alert("Please provide revision remarks for the student group.");
      return;
    }
    setProposals(
      proposals.map((p) =>
        p.id === id
          ? {
              ...p,
              supervisorStatus: "Needs Revision",
              supervisorFeedback: feedbackInput,
            }
          : p
      )
    );
    setActiveProposal(null);
    setFeedbackInput("");
    alert("Revision remarks dispatched to the student group.");
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Proposal Reviews"
        description="Review student project proposals, inspect open-source AI vector similarity scores, and submit supervisor endorsements prior to final coordinator approval."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            {proposals.filter((p) => p.supervisorStatus === "Under Review").length} Pending Review
          </span>
        }
      />

      {/* AI Similarity Info Banner */}
      <div
        className="rounded-[16px] p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
        style={{ backgroundColor: "#17302A" }}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#EBB44B] text-[#17302A] font-bold text-[18px] flex items-center justify-center shrink-0">
            AI
          </div>
          <div>
            <div className="font-bold text-[15px] text-white">
              Open-Source Vector Embedding Check Active
            </div>
            <div className="text-[13px] text-[#D5E3DD]">
              All submissions are vector-indexed with <code>all-MiniLM-L6-v2</code> against 10+ years of departmental archives to prevent duplicate project topics.
            </div>
          </div>
        </div>
        <span className="text-[12px] font-bold text-[#EBB44B] bg-[#EBB44B]/15 border border-[#EBB44B]/30 px-3 py-1 rounded-full whitespace-nowrap">
          Sentence Embeddings
        </span>
      </div>

      {/* Proposals List */}
      <div className="space-y-6">
        {proposals.map((p) => (
          <Card key={p.id} className="p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#EEEEEA]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] font-bold px-2.5 py-0.5 rounded bg-[#17302A] text-white">
                    {p.group}
                  </span>
                  <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded bg-[#E1F4EA] text-[#0B5A3E]">
                    {p.domain}
                  </span>
                  <span className="text-[12px] text-[#5F6B66]">Submitted {p.submittedDate}</span>
                </div>
                <h3 className="font-['Bricolage_Grotesque'] text-[22px] font-bold text-[#17302A]">
                  {p.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-semibold text-[#5F6B66]">Supervisor:</span>
                <Badge
                  variant={
                    p.supervisorStatus === "Endorsed"
                      ? "green"
                      : p.supervisorStatus === "Under Review"
                      ? "blue"
                      : "amber"
                  }
                  size="sm"
                >
                  {p.supervisorStatus}
                </Badge>

                <span className="text-[12px] font-semibold text-[#5F6B66] ml-2">Coordinator:</span>
                <Badge
                  variant={p.coordinatorStatus === "Approved" ? "green" : "gray"}
                  size="sm"
                >
                  {p.coordinatorStatus}
                </Badge>
              </div>
            </div>

            {/* Abstract */}
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#5F6B66] mb-1">
                Project Abstract
              </h4>
              <p className="text-[14px] text-[#17302A] leading-relaxed">
                {p.abstract}
              </p>
            </div>

            {/* AI Similarity & Tech Stack Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#FAFAF8] border border-[#EEEEEA]">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-wider text-[#5F6B66] mb-1">
                  AI Similarity Analysis
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-[#0B5A3E]">
                    {p.aiSimilarity.score}
                  </span>
                  <span className="text-[12px] text-[#5F6B66]">({p.aiSimilarity.model})</span>
                </div>
                <div className="text-[12px] text-[#5F6B66] mt-1">
                  Closest archive record: {p.aiSimilarity.closestMatch}
                </div>
              </div>

              <div>
                <div className="text-[12px] font-bold uppercase tracking-wider text-[#5F6B66] mb-1">
                  Team Members & Tech Stack
                </div>
                <div className="text-[13px] text-[#17302A] font-medium">
                  {p.members.join(", ")}
                </div>
                <div className="text-[12px] text-[#5F6B66] mt-1">
                  Stack: {p.technologies}
                </div>
              </div>
            </div>

            {/* Existing Feedback */}
            {p.supervisorFeedback && (
              <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#F3DFAE] text-[13px]">
                <span className="font-bold text-[#6B4700]">Supervisor Notes: </span>
                <span className="text-[#17302A]">{p.supervisorFeedback}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => alert(`Downloading ${p.title} proposal document PDF...`)}
                className="text-[13px] font-bold text-[#17302A] hover:text-[#C2410C] flex items-center gap-1.5 cursor-pointer"
              >
                &darr; Download Proposal PDF
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveProposal(p);
                    setFeedbackInput(p.supervisorFeedback || "");
                  }}
                  className="rounded-[10px] bg-[#17302A] hover:bg-[#24493F] text-white font-bold text-[13px] px-4 py-2 transition-colors cursor-pointer"
                >
                  Evaluate & Action
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Review Modal */}
      {activeProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-xl w-full shadow-2xl space-y-4 border border-[#E6E6E1]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-0.5 rounded-full">
                  {activeProposal.group}
                </span>
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mt-1">
                  Review: {activeProposal.title}
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
                Supervisor Endorsement Notes / Revision Comments
              </label>
              <textarea
                rows={4}
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder="State your technical review findings, requested scope modifications, or endorsement remarks..."
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white p-3 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6] resize-none"
              />
            </div>

            <div className="p-3 bg-[#FEF3D6] border border-[#F3DFAE] rounded-xl text-[12px] text-[#6B4700]">
              <strong>Note:</strong> Supervisor endorsement validates academic feasibility. Final project ratification remains with the FYP Coordinator.
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
                onClick={() => handleRequestRevision(activeProposal.id)}
                className="px-4 py-2 rounded-[10px] bg-[#EEEEEA] hover:bg-[#E0E0DC] text-[#991B1B] text-[13px] font-bold transition-colors cursor-pointer"
              >
                Request Revisions
              </button>
              <button
                type="button"
                onClick={() => handleEndorse(activeProposal.id)}
                className="px-4 py-2 rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
              >
                Endorse to Coordinator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
