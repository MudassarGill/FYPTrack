import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";
import {
  getSimilarityAudits,
  checkSimilarity,
  getSimilarityBenchmarks,
} from "../../services/api";

export default function SimilarityChecker() {
  const { addToast } = useToast();
  const [audits, setAudits] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [activeTab, setActiveTab] = useState("audits"); // "audits" | "scanner" | "benchmarks"

  // Live scanner state
  const [testForm, setTestForm] = useState({
    title: "Deep Learning for Mandi Agricultural Commodity Pricing",
    domain: "Machine Learning",
    abstract: "Forecasting wholesale mandi pricing using arrival volume and meteorological indices via bidirectional LSTM networks and ARIMA baseline algorithms.",
  });
  const [testResult, setTestResult] = useState(null);
  const [scanning, setScanning] = useState(false);

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
        const overlap = Math.round(a.highest_similarity_percent || (100 - (a.originality_score || 90)));
        const isHigh = overlap >= 20;
        return {
          id: a.project_id,
          currentGroup: a.group_name || "Group",
          currentTitle: a.title,
          currentLead: a.lead_author || "Student",
          similarityScore: overlap,
          originalityScore: a.originality_score || (100 - overlap),
          riskLevel: isHigh ? "High Risk" : (overlap > 10 ? "Moderate" : "Low Risk"),
          matchedProject: a.matched_title || "Historical Capstone Archive",
          matchedYear: a.matched_year || "2023",
          matchedLead: a.matched_lead_author || "Past Graduate",
          matchedSupervisor: a.matched_supervisor || "Department Faculty",
          currentSnippet: a.current_abstract || "Project abstract submitted by student group for departmental evaluation.",
          matchedSnippet: a.matched_abstract || "Baseline comparative implementation exploring related domain models and architectural constraints.",
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

  const handleLiveScan = async (e) => {
    e.preventDefault();
    if (!testForm.title.trim() || !testForm.abstract.trim()) {
      addToast("Please provide both title and abstract for scanning.", "error");
      return;
    }
    try {
      setScanning(true);
      const res = await checkSimilarity(testForm);
      setTestResult(res);
      addToast("Similarity scan completed against institutional thesis benchmark pool.");
    } catch (err) {
      console.error(err);
      addToast("Scan failed. Ensure backend services are running.", "error");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Project Originality & Novelty Checker"
        description="Verify project novelty using natural language processing comparison against the departmental thesis benchmark archive."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("audits")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                activeTab === "audits"
                  ? "bg-[#17302A] text-white"
                  : "bg-white border border-[#E6E6E1] text-[#5F6B66] hover:bg-[#FAFAF8]"
              }`}
            >
              Proposals Audit ({audits.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("scanner")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                activeTab === "scanner"
                  ? "bg-[#EBB44B] text-[#17302A] font-bold"
                  : "bg-white border border-[#E6E6E1] text-[#5F6B66] hover:bg-[#FAFAF8]"
              }`}
            >
              Live Proposal Scanner
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("benchmarks")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                activeTab === "benchmarks"
                  ? "bg-[#17302A] text-white"
                  : "bg-white border border-[#E6E6E1] text-[#5F6B66] hover:bg-[#FAFAF8]"
              }`}
            >
              Archive Pool ({benchmarks.length})
            </button>
          </div>
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
              TF-IDF Term-Frequency & Cosine Similarity Engine
            </div>
            <div className="text-[13px] text-[#D5E3DD]">
              Abstracts are vectorized with stopword pruning, n-gram extraction, and cosine correlation against past department capstone archives. Proposals with overlap &ge; 20% trigger coordinator review.
            </div>
          </div>
        </div>
        <span className="text-[12px] font-bold text-[#EBB44B] bg-[#EBB44B]/15 border border-[#EBB44B]/30 px-3 py-1 rounded-full whitespace-nowrap">
          Archive Pool: {benchmarks.length} Historical Theses
        </span>
      </div>

      {/* TAB 1: AUDITS QUEUE */}
      {activeTab === "audits" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Submissions List (1fr) */}
          <div className="space-y-3">
            <h3 className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A]">
              Similarity Audit Queue
            </h3>

            {audits.length === 0 ? (
              <div className="p-8 text-center bg-white border border-[#EEEEEA] rounded-xl text-[#5F6B66] text-[13px]">
                No student proposals submitted yet.
              </div>
            ) : (
              audits.map((a) => (
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
                      variant={a.riskLevel === "High Risk" ? "gray" : a.riskLevel === "Moderate" ? "amber" : "green"}
                      size="sm"
                    >
                      {a.similarityScore}% Overlap
                    </Badge>
                  </div>

                  <div className="font-bold text-[14px] text-[#17302A] line-clamp-1">
                    {a.currentTitle}
                  </div>
                  <div className="text-[12px] text-[#5F6B66] mt-1 line-clamp-1">
                    Matched: {a.matchedProject} ({a.matchedYear})
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className={a.cleared ? "text-[#0B5A3E] font-bold" : "text-red-700 font-bold"}>
                      {a.cleared ? "✓ Cleared by Committee" : "⚠ Review Required"}
                    </span>
                    <span className="text-[#8A948F]">Inspect &rarr;</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Side-by-Side Semantic Diff Inspector (2fr) */}
          <div className="lg:col-span-2 space-y-4">
            {selectedAudit ? (
              <Card className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EEEEEA]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-0.5 rounded-full">
                      NLP Vector Diff Inspector
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

                {/* Overlap keywords tag cloud */}
                {selectedAudit.matchedKeywords?.length > 0 && (
                  <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#EEEEEA]">
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

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Proposal */}
                  <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#EEEEEA] space-y-2">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#17302A]">Current 2026 Proposal</span>
                      <span className="text-[#5F6B66]">{selectedAudit.currentGroup}</span>
                    </div>
                    <div className="text-[11px] text-[#5F6B66]">Lead: {selectedAudit.currentLead}</div>
                    <div className="p-3 bg-white rounded-lg border border-[#E6E6E1] text-[13px] text-[#17302A] leading-relaxed max-h-56 overflow-y-auto">
                      {selectedAudit.currentSnippet}
                    </div>
                  </div>

                  {/* Historical Archive */}
                  <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#F3DFAE] space-y-2">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-bold text-[#6B4700]">Department Archive ({selectedAudit.matchedYear})</span>
                      <span className="text-[#6B4700]">Thesis Record</span>
                    </div>
                    <div className="text-[11px] text-[#5F6B66]">Author: {selectedAudit.matchedLead} | Sup: {selectedAudit.matchedSupervisor}</div>
                    <div className="p-3 bg-white rounded-lg border border-[#F3DFAE] text-[13px] text-[#17302A] leading-relaxed max-h-56 overflow-y-auto">
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
                      onClick={() => addToast(`Revision request dispatched to ${selectedAudit.currentGroup}.`, "info")}
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

      {/* TAB 2: LIVE PROPOSAL SCANNER */}
      {activeTab === "scanner" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
              Test Any Proposal Text Against Archive Pool
            </h3>
            <p className="text-[13px] text-[#5F6B66]">
              Paste any proposed capstone title, domain, and abstract to test real-time TF-IDF cosine comparison against all past departmental theses.
            </p>

            <form onSubmit={handleLiveScan} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1">
                  Proposed Project Title
                </label>
                <input
                  type="text"
                  value={testForm.title}
                  onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E6E6E1] text-[14px] text-[#17302A] focus:outline-none focus:border-[#17302A]"
                  placeholder="e.g. Wheat Yield and Commodity Price Prediction"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1">
                  Technical Domain
                </label>
                <input
                  type="text"
                  value={testForm.domain}
                  onChange={(e) => setTestForm({ ...testForm, domain: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E6E6E1] text-[14px] text-[#17302A] focus:outline-none focus:border-[#17302A]"
                  placeholder="e.g. Machine Learning, Blockchain, IoT"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1">
                  Project Abstract / Problem Statement
                </label>
                <textarea
                  rows={5}
                  value={testForm.abstract}
                  onChange={(e) => setTestForm({ ...testForm, abstract: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E6E6E1] text-[14px] text-[#17302A] focus:outline-none focus:border-[#17302A]"
                  placeholder="Type or paste the comprehensive problem description..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={scanning}
                className="w-full py-3 rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] transition-colors cursor-pointer"
              >
                {scanning ? "Computing Vector Cosine Distances..." : "Run Live Similarity Scan"}
              </button>
            </form>
          </Card>

          {/* Scanner Results Panel */}
          <div className="space-y-4">
            {testResult ? (
              <Card className="p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEA]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-0.5 rounded-full">
                      Scan Result
                    </span>
                    <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mt-1">
                      Novelty: {testResult.originality_score}%
                    </h3>
                  </div>
                  <span
                    className={`text-[13px] font-bold px-3 py-1 rounded-full border ${
                      testResult.highest_similarity_percent >= 20
                        ? "text-red-700 bg-red-50 border-red-200"
                        : "text-[#0B5A3E] bg-[#E1F4EA] border-[#B5E2CE]"
                    }`}
                  >
                    {testResult.highest_similarity_percent}% Overlap ({testResult.status})
                  </span>
                </div>

                <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#EEEEEA] space-y-2">
                  <div className="text-[13px] font-bold text-[#17302A]">
                    Closest Historical Match:
                  </div>
                  <div className="text-[14px] font-semibold text-[#17302A]">
                    {testResult.matched_title || "None"} ({testResult.matched_year || "N/A"})
                  </div>
                  <div className="text-[12px] text-[#5F6B66]">
                    Archive ID: {testResult.matched_project_id || "N/A"} &bull; Lead: {testResult.matched_lead_author || "Past Student"} &bull; Supervisor: {testResult.matched_supervisor || "N/A"}
                  </div>
                </div>

                {testResult.matched_overlap_keywords?.length > 0 && (
                  <div>
                    <div className="text-[12px] font-semibold text-[#17302A] mb-1.5">
                      Intersecting Term Signatures:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {testResult.matched_overlap_keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-[#EBB44B]/20 text-[#6B4700] text-[12px] font-semibold"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3.5 rounded-lg bg-[#F8F9FA] border border-[#EEEEEA] text-[13px] text-[#5F6B66] leading-relaxed">
                  {testResult.summary}
                </div>
              </Card>
            ) : (
              <div className="card-base text-center py-24 text-[#5F6B66]">
                <div className="w-12 h-12 rounded-full bg-[#FAFAF8] border border-[#EEEEEA] flex items-center justify-center mx-auto mb-3 text-xl">
                  🔍
                </div>
                <div className="font-semibold text-[#17302A]">Awaiting Input</div>
                <div className="text-[13px] mt-1 max-w-sm mx-auto">
                  Enter project parameters on the left and run the scan to evaluate originality against past department cohorts.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BENCHMARK ARCHIVE POOL */}
      {activeTab === "benchmarks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
              Department Thesis Archive Benchmark Pool (2021–2025)
            </h3>
            <span className="text-[12px] text-[#5F6B66]">
              {benchmarks.length} Indexed Reference Dissertations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benchmarks.map((b) => (
              <div key={b.id} className="card-base space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-[#17302A] text-white">
                    {b.id}
                  </span>
                  <span className="font-semibold text-[#0B5A3E] bg-[#E1F4EA] px-2 py-0.5 rounded">
                    Batch {b.year}
                  </span>
                </div>
                <h4 className="font-['Bricolage_Grotesque'] font-bold text-[16px] text-[#17302A]">
                  {b.title}
                </h4>
                <div className="text-[12px] text-[#5F6B66]">
                  Author: <span className="font-semibold text-[#17302A]">{b.lead_author}</span> &bull; Supervisor: <span className="font-semibold text-[#17302A]">{b.supervisor}</span>
                </div>
                <p className="text-[13px] text-[#5F6B66] line-clamp-3 leading-relaxed">
                  {b.abstract}
                </p>
                <div className="text-[11px] font-mono text-[#8A948F] pt-2 border-t border-[#EEEEEA]">
                  Stack: {b.technologies}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
