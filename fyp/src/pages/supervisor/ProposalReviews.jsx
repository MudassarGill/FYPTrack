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
    submittedDate: "14 Oct 2026",
    abstract:
      "A deep learning and time-series forecasting model analyzing mandi arrival volumes, seasonal meteorological patterns, and supply chain indicators to project future wholesale crop prices across major agricultural zones.",
    technologies: "Python, FastAPI, TensorFlow, React, PostgreSQL",
    aiSimilarity: {
      score: "94% Unique",
      closestMatch: "Wheat Yield Forecasting (2024, 6% overlap)",
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
      closestMatch: "Distributed Hospital Radiology (2023, 4% similarity)",
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
      closestMatch: "Fabric Flaw Detector (2022, 11% overlap)",
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
  const { addToast } = useToast();

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
    addToast("Proposal endorsed and forwarded to coordinator.");
  };

  const handleRequestRevision = (id) => {
    if (!feedbackInput.trim()) {
      addToast("Please provide revision remarks.", "warning");
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
    addToast("Revision remarks sent to the student group.");
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Proposal Reviews"
        description="Review student project proposals, check originality scores, and submit your endorsement before coordinator approval."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            {proposals.filter((p) => p.supervisorStatus === "Under Review").length} Pending Review
          </span>
        }
      />

      {/* Originality Status Banner */}
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
          Automated Screening
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
                </div>
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                  {p.title}
                </h3>
                <div className="text-[13px] text-[#5F6B66] mt-1">
                  Lead: {p.leadStudent} &middot; Domain: {p.domain} &middot; Submitted: {p.submittedDate}
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-[12px] font-bold px-2.5 py-1 rounded-full bg-[#E1F4EA] text-[#0B5A3E] border border-[#C5E8D6]">
                  {p.aiSimilarity.score}
                </span>
                <button
                  type="button"
                  onClick={() => addToast(`Downloading ${p.title} proposal PDF...`, "info")}
                  className="text-[12px] font-bold text-[#17302A] underline cursor-pointer hover:text-[#EBB44B]"
                >
                  Download PDF
                </button>
              </div>
            </div>

            {/* Abstract */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A948F] mb-1">Abstract</div>
              <p className="text-[14px] text-[#17302A] leading-relaxed">{p.abstract}</p>
            </div>

            {/* Tech + Similarity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#EEEEEA]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A948F] mb-1">Technologies</div>
                <div className="text-[13px] text-[#17302A] font-medium">{p.technologies}</div>
              </div>
              <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#EEEEEA]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A948F] mb-1">Originality Check</div>
                <div className="text-[13px] text-[#17302A] font-medium">{p.aiSimilarity.score}</div>
                <div className="text-[12px] text-[#5F6B66]">Closest match: {p.aiSimilarity.closestMatch}</div>
              </div>
            </div>

            {/* Supervisor Feedback */}
            {p.supervisorFeedback && (
              <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#F3DFAE]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B4700] mb-1">
                  Supervisor Feedback
                </div>
                <p className="text-[13px] text-[#17302A]">{p.supervisorFeedback}</p>
              </div>
            )}

            {/* Actions */}
            {p.supervisorStatus !== "Endorsed" && (
              <div className="pt-3 border-t border-[#EEEEEA]">
                {activeProposal === p.id ? (
                  <div className="space-y-3">
                    <textarea
                      className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6] resize-none"
                      rows={3}
                      placeholder="Write your feedback or revision remarks..."
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEndorse(p.id)}
                        className="px-4 py-2 rounded-[8px] bg-[#0B5A3E] hover:bg-[#094731] text-white text-[12px] font-bold cursor-pointer transition-colors"
                      >
                        Endorse Proposal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRequestRevision(p.id)}
                        className="px-4 py-2 rounded-[8px] bg-red-100 hover:bg-red-200 text-red-800 text-[12px] font-bold cursor-pointer transition-colors"
                      >
                        Request Revision
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
                    Review & Submit Feedback
                  </button>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
