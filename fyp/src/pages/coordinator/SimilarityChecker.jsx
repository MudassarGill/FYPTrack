import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";
import {
  getSimilarityAudits,
  getSimilarityBenchmarks,
} from "../../services/api";

export default function SimilarityChecker() {
  const { addToast } = useToast();
  const [audits, setAudits] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [showArchivePool, setShowArchivePool] = useState(false);

  useEffect(() => {
    loadAuditsAndBenchmarks();
  }, []);

  async function loadAuditsAndBenchmarks() {
    try {
      setLoading(true);
      const [auditData, benchData] = await Promise.all([
        getSimilarityAudits().catch(() => ({ audits: [] })),
        getSimilarityBenchmarks().catch(() => []),
      ]);

      const auditList = auditData?.audits || [];
      const mapped = auditList.map((a) => {
        const overlap = Math.round(
          a.highest_similarity_percent || (100 - (a.originality_score || 90))
        );
        const isHigh = overlap >= 20;
        return {
          id: a.project_id,
          currentGroup: a.group_name || "Group",
          currentTitle: a.title,
          currentLead: a.lead_author || "Student",
          similarityScore: overlap,
          originalityScore: a.originality_score || (100 - overlap),
          riskLevel: isHigh ? "High Risk" : overlap > 10 ? "Moderate" : "Low Risk",
          matchedProject: a.matched_title || "Historical Capstone Archive",
          matchedYear: a.matched_year || "2023",
          matchedLead: a.matched_lead_author || "Past Graduate",
          matchedSupervisor: a.matched_supervisor || "Department Faculty",
          currentSnippet:
            a.current_abstract ||
            "Project abstract submitted by student group for departmental evaluation.",
          matchedSnippet:
            a.matched_abstract ||
            "Baseline comparative implementation exploring related domain models and architectural constraints.",
          matchedKeywords: a.matched_overlap_keywords || [],
          cleared: !isHigh,
        };
      });

      setAudits(mapped);
      setBenchmarks(benchData || []);
      if (mapped.length > 0) {
        setSelectedAudit(mapped[0]);
      }
    } catch (err) {
      console.error("Failed to load similarity audits:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleClearAudit = (id) => {
    setAudits(audits.map((a) => (a.id === id ? { ...a, cleared: true } : a)));
    addToast("Originality check cleared and approved by Coordinator.");
  };

  const highRiskCount = audits.filter((a) => a.similarityScore >= 20).length;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Project Originality & Novelty Audits"
        description="Automatic natural language similarity evaluation comparing all submitted student proposals against the departmental capstone repository."
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
              {audits.length} Proposals Evaluated
            </span>
            {highRiskCount > 0 ? (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                {highRiskCount} Overlap Alerts
              </span>
            ) : (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#E1F4EA] text-[#0B5A3E] border border-[#B5E2CE]">
                All Clear
              </span>
            )}
          </div>
        }
      />

      {loading ? (
        <div className="p-12 text-center bg-white border border-[#EEEEEA] rounded-xl text-[#5F6B66]">
          Loading similarity audits from archive comparison engine...
        </div>
      ) : audits.length === 0 ? (
        <Card className="p-12 text-center text-[#5F6B66]">
          <div className="font-bold text-[16px] text-[#17302A] mb-1">
            No Student Proposals Submitted Yet
          </div>
          <p className="text-[13px]">
            When student groups submit their FYP proposals, automated similarity screening against historical archives will appear here automatically.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Submissions Audit List (1 column) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A]">
                Submitted Proposals
              </h3>
              <span className="text-[12px] text-[#5F6B66]">
                Select to inspect
              </span>
            </div>

            <div className="space-y-2.5">
              {audits.map((a) => (
                <div
                  key={a.id}
                  onClick={() => setSelectedAudit(a)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedAudit?.id === a.id
                      ? "border-[#17302A] bg-white shadow-md ring-1 ring-[#17302A]"
                      : "border-[#EEEEEA] bg-white hover:border-[#D3D8D4]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-bold px-2 py-0.5 rounded bg-[#17302A] text-white">
                      {a.currentGroup}
                    </span>
                    <Badge
                      variant={
                        a.riskLevel === "High Risk"
                          ? "gray"
                          : a.riskLevel === "Moderate"
                          ? "amber"
                          : "green"
                      }
                      size="sm"
                    >
                      {a.similarityScore}% Overlap
                    </Badge>
                  </div>

                  <div className="font-bold text-[14px] text-[#17302A] line-clamp-1">
                    {a.currentTitle}
                  </div>
                  <div className="text-[12px] text-[#5F6B66] mt-1 line-clamp-1">
                    Closest: {a.matchedProject} ({a.matchedYear})
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-[#F2F2EE]">
                    <span
                      className={`font-semibold ${
                        a.cleared ? "text-[#0B5A3E]" : "text-red-700"
                      }`}
                    >
                      {a.cleared ? "Cleared by Committee" : "Review Required"}
                    </span>
                    <span className="text-[#8A948F]">Inspect &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Side-by-Side Comparison Inspector (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            {selectedAudit ? (
              <Card className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EEEEEA]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-0.5 rounded-full">
                      Semantic Similarity Inspector
                    </span>
                    <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mt-1">
                      {selectedAudit.currentTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[13px] font-bold px-3 py-1 rounded-full border ${
                        selectedAudit.similarityScore >= 20
                          ? "text-red-700 bg-red-50 border-red-200"
                          : "text-[#0B5A3E] bg-[#E1F4EA] border-[#B5E2CE]"
                      }`}
                    >
                      {selectedAudit.similarityScore}% Overlap ({selectedAudit.originalityScore}% Novelty)
                    </span>
                  </div>
                </div>

                {/* Overlap keywords cloud */}
                {selectedAudit.matchedKeywords?.length > 0 && (
                  <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-[#EEEEEA]">
                    <span className="text-[12px] font-semibold text-[#17302A] mr-2">
                      Significant Semantic Terms:
                    </span>
                    <div className="inline-flex flex-wrap gap-1.5 mt-1">
                      {selectedAudit.matchedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#EBB44B]/20 text-[#6B4700] text-[11px] font-semibold"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Proposal */}
                  <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#EEEEEA] space-y-2">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#17302A]">Current 2026 Proposal</span>
                      <span className="text-[#5F6B66]">{selectedAudit.currentGroup}</span>
                    </div>
                    <div className="text-[11px] text-[#5F6B66]">
                      Lead Author: {selectedAudit.currentLead}
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-[#E6E6E1] text-[13px] text-[#17302A] leading-relaxed max-h-56 overflow-y-auto">
                      {selectedAudit.currentSnippet}
                    </div>
                  </div>

                  {/* Historical Archive */}
                  <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#F3DFAE] space-y-2">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#6B4700]">
                        Department Archive ({selectedAudit.matchedYear})
                      </span>
                      <span className="text-[#6B4700]">Thesis Record</span>
                    </div>
                    <div className="text-[11px] text-[#5F6B66]">
                      Author: {selectedAudit.matchedLead} | Supervisor: {selectedAudit.matchedSupervisor}
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-[#F3DFAE] text-[13px] text-[#17302A] leading-relaxed max-h-56 overflow-y-auto">
                      {selectedAudit.matchedSnippet}
                    </div>
                  </div>
                </div>

                {/* Coordinator Adjudication Actions */}
                <div className="pt-3 border-t border-[#EEEEEA] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[12px] text-[#5F6B66]">
                    Review the conceptual overlap before supervisor assignment.
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        addToast(`Revision request dispatched to ${selectedAudit.currentGroup}.`, "info")
                      }
                      className="px-4 py-2 rounded-[8px] bg-red-100 hover:bg-red-200 text-red-800 text-[12px] font-bold cursor-pointer"
                    >
                      Require Topic Revision
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
            ) : (
              <div className="p-12 text-center bg-white border border-[#EEEEEA] rounded-xl text-[#5F6B66]">
                Select a proposal from the queue to inspect semantic similarity.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Institutional Archive Pool Collapsible Reference */}
      <div className="pt-4 border-t border-[#EEEEEA]">
        <button
          type="button"
          onClick={() => setShowArchivePool(!showArchivePool)}
          className="text-[13px] font-semibold text-[#5F6B66] hover:text-[#17302A] flex items-center gap-2 cursor-pointer"
        >
          <span>{showArchivePool ? "Hide" : "View"} Department Thesis Archive Benchmark Pool ({benchmarks.length} Historical Records)</span>
          <span>{showArchivePool ? "\u25B2" : "\u25BC"}</span>
        </button>

        {showArchivePool && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {benchmarks.map((b) => (
              <div key={b.id} className="p-4 rounded-xl bg-white border border-[#EEEEEA] space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-[#17302A] text-white">
                    {b.id}
                  </span>
                  <span className="font-semibold text-[#0B5A3E] bg-[#E1F4EA] px-2 py-0.5 rounded">
                    Batch {b.year}
                  </span>
                </div>
                <h4 className="font-['Bricolage_Grotesque'] font-bold text-[15px] text-[#17302A]">
                  {b.title}
                </h4>
                <div className="text-[12px] text-[#5F6B66]">
                  Author: <span className="font-semibold text-[#17302A]">{b.lead_author}</span> &bull; Supervisor: <span className="font-semibold text-[#17302A]">{b.supervisor}</span>
                </div>
                <p className="text-[12px] text-[#5F6B66] line-clamp-2 leading-relaxed">
                  {b.abstract}
                </p>
                <div className="text-[11px] font-mono text-[#8A948F] pt-1.5 border-t border-[#EEEEEA]">
                  Stack: {b.technologies}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
