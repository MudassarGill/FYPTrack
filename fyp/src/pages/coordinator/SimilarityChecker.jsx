import { useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";

const initialAudits = [
  {
    id: 1,
    currentGroup: "Group 42",
    currentTitle: "Blockchain Powered Degree Verification Protocol",
    currentLead: "Zubair Ahmad",
    similarityScore: 24, // 24% overlap -> 76% unique
    riskLevel: "High Risk",
    matchedProject: "Ethereum-Based Academic Credential Notarization System",
    matchedYear: "2024",
    matchedLead: "Ahmed Hassan (FA19-BCS-044)",
    currentSnippet:
      "This system deploys smart contracts on Ethereum to store cryptographic hashes of university diplomas, enabling instant employer verification via web3 wallets.",
    matchedSnippet:
      "Our system deploys smart contracts on Ethereum rollups to store cryptographic hashes of institutional diplomas, enabling automated third-party employer verification.",
    cleared: false,
  },
  {
    id: 2,
    currentGroup: "Group 14",
    currentTitle: "Crop Price Prediction and Market Advisory System",
    currentLead: "Ayesha Noor",
    similarityScore: 6, // 6% overlap -> 94% unique
    riskLevel: "Low Risk",
    matchedProject: "Wheat Yield Forecasting and Mandi Analytics",
    matchedYear: "2023",
    matchedLead: "Usama Rauf (FA19-BSE-012)",
    currentSnippet:
      "Forecasting wholesale mandi pricing using multi-season arrival volume and meteorological indices via bidirectional LSTM networks.",
    matchedSnippet:
      "Predicting Punjab wheat output using seasonal rainfall and district mandi supply logs via gradient boosted regressors.",
    cleared: true,
  },
  {
    id: 3,
    currentGroup: "Group 19",
    currentTitle: "Real-Time Edge Defect Inspection for Textile Looms",
    currentLead: "Fahad Mustafa",
    similarityScore: 11,
    riskLevel: "Moderate",
    matchedProject: "Fabric Defect Detection on Edge TPU",
    matchedYear: "2022",
    matchedLead: "Taimoor Shah (FA18-BCE-072)",
    currentSnippet:
      "Mounted camera running quantized YOLOv8 models on microcontrollers to flag warp inconsistencies.",
    matchedSnippet:
      "Embedded camera utilizing quantized MobileNet SSD running on Coral Edge TPU for defect localization.",
    cleared: true,
  },
];

export default function SimilarityChecker() {
  const [audits, setAudits] = useState(initialAudits);
  const [selectedAudit, setSelectedAudit] = useState(audits[0]);

  const handleClearAudit = (id) => {
    setAudits(audits.map((a) => (a.id === id ? { ...a, cleared: true } : a)));
    alert("Similarity flag resolved and cleared by Coordinator.");
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="AI Vector Similarity & Plagiarism Sentinel"
        description="Inspect semantic topic overlap and lexical duplication between 2026 project proposals and 450+ archived departmental projects."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            Model: all-MiniLM-L6-v2 Embeddings
          </span>
        }
      />

      {/* Model Technical Specifications Banner */}
      <div
        className="rounded-[16px] p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
        style={{ backgroundColor: "#17302A" }}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#EBB44B] text-[#17302A] font-bold text-[18px] flex items-center justify-center shrink-0">
            NLP
          </div>
          <div>
            <div className="font-bold text-[15px] text-white">
              Open-Source Vector Cosine Distance Engine
            </div>
            <div className="text-[13px] text-[#D5E3DD]">
              Abstracts are vectorized into 384-dimensional dense semantic embeddings. Any proposal with cosine similarity &gt; 0.20 against historical records triggers institutional review.
            </div>
          </div>
        </div>
        <span className="text-[12px] font-bold text-[#EBB44B] bg-[#EBB44B]/15 border border-[#EBB44B]/30 px-3 py-1 rounded-full whitespace-nowrap">
          Vector Index: 498 Archives
        </span>
      </div>

      {/* Inspection Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Flagged Submissions List (1fr) */}
        <div className="space-y-3">
          <h3 className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A]">
            Similarity Audit Queue
          </h3>

          {audits.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelectedAudit(a)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedAudit.id === a.id
                  ? "border-[#17302A] bg-white shadow-md ring-1 ring-[#17302A]"
                  : "border-[#EEEEEA] bg-white hover:border-[#D3D8D4]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-bold px-2 py-0.5 rounded bg-[#17302A] text-white">
                  {a.currentGroup}
                </span>
                <Badge
                  variant={a.riskLevel === "High Risk" ? "gray" : a.riskLevel === "Moderate" ? "amber" : "green"}
                  size="sm"
                >
                  {a.similarityScore}% Overlap
                </Badge>
              </div>

              <div className="font-bold text-[14px] text-[#17302A] line-clamp-1">
                {a.currentTitle}
              </div>
              <div className="text-[12px] text-[#5F6B66] mt-1">
                Matched Archive: {a.matchedProject.slice(0, 30)}... ({a.matchedYear})
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className={a.cleared ? "text-[#0B5A3E] font-bold" : "text-red-700 font-bold"}>
                  {a.cleared ? "✓ Cleared by Committee" : "⚠ Review Required"}
                </span>
                <span className="text-[#8A948F]">Inspect &rarr;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Side-by-Side Semantic Diff Inspector (2fr) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EEEEEA]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-0.5 rounded-full">
                  Vector Diff Inspector
                </span>
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mt-1">
                  {selectedAudit.currentTitle}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  {selectedAudit.similarityScore}% Semantic Overlap
                </span>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 2026 Proposal */}
              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#EEEEEA] space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-bold text-[#17302A]">Current 2026 Proposal</span>
                  <span className="text-[#5F6B66]">{selectedAudit.currentGroup}</span>
                </div>
                <div className="text-[11px] text-[#5F6B66]">Lead: {selectedAudit.currentLead}</div>
                <div className="p-3 bg-white rounded-lg border border-[#E6E6E1] text-[13px] text-[#17302A] leading-relaxed">
                  {selectedAudit.currentSnippet}
                </div>
              </div>

              {/* Historical Archive */}
              <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#F3DFAE] space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-bold text-[#6B4700]">Department Archive ({selectedAudit.matchedYear})</span>
                  <span className="text-[#6B4700]">Thesis Record</span>
                </div>
                <div className="text-[11px] text-[#5F6B66]">Author: {selectedAudit.matchedLead}</div>
                <div className="p-3 bg-white rounded-lg border border-[#F3DFAE] text-[13px] text-[#17302A] leading-relaxed">
                  {selectedAudit.matchedSnippet}
                </div>
              </div>
            </div>

            {/* Coordinator Adjudication Actions */}
            <div className="pt-3 border-t border-[#EEEEEA] flex flex-wrap items-center justify-between gap-3">
              <span className="text-[12px] text-[#5F6B66]">
                Review the conceptual scope before clearing for supervisor assignment.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Sent revision order to ${selectedAudit.currentGroup} for scope divergence.`)}
                  className="px-4 py-2 rounded-[8px] bg-red-100 hover:bg-red-200 text-red-800 text-[12px] font-bold cursor-pointer"
                >
                  Require Topic Divergence
                </button>
                <button
                  type="button"
                  onClick={() => handleClearAudit(selectedAudit.id)}
                  className="px-4 py-2 rounded-[8px] bg-[#0B5A3E] hover:bg-[#094731] text-white text-[12px] font-bold cursor-pointer"
                >
                  Approve as Legitimate Novelty
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
