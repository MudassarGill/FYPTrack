import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";
import { getMyProjects, submitEvaluationMarks, getProjectEvaluations } from "../../services/api";

export default function Evaluations() {
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [marks, setMarks] = useState({
    criteria1: 8,
    criteria2: 8,
    criteria3: 4,
    criteria4: 4,
  });
  const [remarks, setRemarks] = useState("Consistent progress on core methodology and milestones.");

  useEffect(() => {
    loadEvaluationsData();
  }, []);

  async function loadEvaluationsData() {
    try {
      setLoading(true);
      const myProjs = await getMyProjects();
      setProjects(myProjs || []);
    } catch (err) {
      console.error("Failed to load evaluation data:", err);
    } finally {
      setLoading(false);
    }
  }

  const activeProject = projects[selectedProjectIndex];

  useEffect(() => {
    if (!activeProject) return;
    getProjectEvaluations(activeProject.id)
      .then((existing) => {
        if (existing && existing.length > 0) {
          const ev = existing[0];
          setMarks({
            criteria1: ev.criteria1,
            criteria2: ev.criteria2,
            criteria3: ev.criteria3,
            criteria4: ev.criteria4,
          });
          setRemarks(ev.remarks || "");
        } else {
          setMarks({
            criteria1: 0,
            criteria2: 0,
            criteria3: 0,
            criteria4: 0,
          });
          setRemarks("");
        }
      })
      .catch((err) => console.error("Failed to load project marks:", err));
  }, [activeProject?.id]);

  const totalScore = (marks.criteria1 || 0) + (marks.criteria2 || 0) + (marks.criteria3 || 0) + (marks.criteria4 || 0);

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    if (!activeProject) return;

    try {
      setSaving(true);
      await submitEvaluationMarks({
        project_id: activeProject.id,
        student_name: activeProject.student_name,
        roll_number: "FA20-BSE",
        criteria1: marks.criteria1,
        criteria2: marks.criteria2,
        criteria3: marks.criteria3,
        criteria4: marks.criteria4,
        remarks: remarks,
      });
      addToast(`Evaluation scores for ${activeProject.group_name} (${totalScore}/30) saved to database successfully.`);
    } catch (err) {
      addToast(err.message || "Failed to save marks.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Evaluations & Marks"
        description="Authorized continuous evaluation portal. Record milestone grades and official rubric scores for your supervised student groups."
      />

      {projects.length === 0 ? (
        <div className="card-base text-center py-12 text-[#5F6B66]">
          <div className="text-[16px] font-semibold text-[#17302A]">No assigned groups to evaluate</div>
          <p className="text-[13px] mt-1">
            Student groups assigned to you by the coordinator will be listed here for milestone rubric grading.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Group Selector */}
          <div className="space-y-3">
            <h3 className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A]">
              Assigned Groups ({projects.length})
            </h3>
            <div className="space-y-2">
              {projects.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProjectIndex(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedProjectIndex === idx
                      ? "bg-[#17302A] text-white border-[#17302A] shadow-md"
                      : "bg-white border-[#EEEEEA] text-[#17302A] hover:bg-[#F8F9F8]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[14px]">{p.group_name}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${selectedProjectIndex === idx ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className={`text-[12px] truncate ${selectedProjectIndex === idx ? "text-[#CFE0D9]" : "text-[#5F6B66]"}`}>
                    {p.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Scoring Form */}
          <div className="lg:col-span-2">
            {activeProject && (
              <Card className="p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-bold px-2.5 py-0.5 rounded bg-[#17302A] text-white">
                      {activeProject.group_name}
                    </span>
                    <span className="text-[13px] text-[#5F6B66]">
                      Student: <span className="font-bold text-[#17302A]">{activeProject.student_name}</span>
                    </span>
                  </div>
                  <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                    {activeProject.title}
                  </h3>
                </div>

                <form onSubmit={handleSaveMarks} className="space-y-5">
                  <div className="space-y-4">
                    {/* Criteria 1 */}
                    <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#EEEEEA] flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-[14px] text-[#17302A]">
                          1. Problem Formulation &amp; Literature Review
                        </div>
                        <div className="text-[12px] text-[#5F6B66]">Problem clarity, scope validity and background research</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={marks.criteria1}
                          onChange={(e) => setMarks({ ...marks, criteria1: Math.min(10, Math.max(0, parseInt(e.target.value) || 0)) })}
                          className="w-16 rounded-[8px] border border-[#D3D8D4] bg-white p-2 text-center font-bold text-[15px] outline-none"
                        />
                        <span className="text-[13px] text-[#5F6B66] font-semibold">/ 10</span>
                      </div>
                    </div>

                    {/* Criteria 2 */}
                    <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#EEEEEA] flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-[14px] text-[#17302A]">
                          2. Methodology &amp; System Architecture
                        </div>
                        <div className="text-[12px] text-[#5F6B66]">Design diagrams, mathematical modeling and tools justification</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={marks.criteria2}
                          onChange={(e) => setMarks({ ...marks, criteria2: Math.min(10, Math.max(0, parseInt(e.target.value) || 0)) })}
                          className="w-16 rounded-[8px] border border-[#D3D8D4] bg-white p-2 text-center font-bold text-[15px] outline-none"
                        />
                        <span className="text-[13px] text-[#5F6B66] font-semibold">/ 10</span>
                      </div>
                    </div>

                    {/* Criteria 3 */}
                    <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#EEEEEA] flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-[14px] text-[#17302A]">
                          3. Implementation &amp; Milestone Deliverables
                        </div>
                        <div className="text-[12px] text-[#5F6B66]">Code cleanliness, dataset preparation and deliverable punctuality</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={marks.criteria3}
                          onChange={(e) => setMarks({ ...marks, criteria3: Math.min(5, Math.max(0, parseInt(e.target.value) || 0)) })}
                          className="w-16 rounded-[8px] border border-[#D3D8D4] bg-white p-2 text-center font-bold text-[15px] outline-none"
                        />
                        <span className="text-[13px] text-[#5F6B66] font-semibold">/ 5</span>
                      </div>
                    </div>

                    {/* Criteria 4 */}
                    <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#EEEEEA] flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-[14px] text-[#17302A]">
                          4. Presentation, Technical Viva &amp; Rigor
                        </div>
                        <div className="text-[12px] text-[#5F6B66]">Individual mastery, defense clarity and answers to technical questions</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={marks.criteria4}
                          onChange={(e) => setMarks({ ...marks, criteria4: Math.min(5, Math.max(0, parseInt(e.target.value) || 0)) })}
                          className="w-16 rounded-[8px] border border-[#D3D8D4] bg-white p-2 text-center font-bold text-[15px] outline-none"
                        />
                        <span className="text-[13px] text-[#5F6B66] font-semibold">/ 5</span>
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                      Official Evaluator Remarks
                    </label>
                    <textarea
                      rows={3}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full rounded-[10px] border border-[#D3D8D4] bg-white p-3 text-[13px] outline-none focus:border-[#EBB44B] resize-none"
                      placeholder="Enter formal rubric assessment remarks..."
                    />
                  </div>

                  {/* Total & Submit */}
                  <div className="pt-4 border-t border-[#EEEEEA] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[14px] text-[#5F6B66] font-medium">Cumulative Score:</span>
                      <span className="font-['Bricolage_Grotesque'] text-[28px] font-bold text-[#17302A]">
                        {totalScore}
                      </span>
                      <span className="text-[14px] text-[#5F6B66] font-bold">/ 30 Marks</span>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-6 py-2.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Submit Marks to Database"}
                    </button>
                  </div>
                </form>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
