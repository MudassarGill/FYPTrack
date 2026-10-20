import { useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";

const evaluationGroups = [
  {
    group: "Group 14",
    title: "Crop Price Prediction and Market Advisory System",
    members: [
      { name: "Ayesha Noor", roll: "FA20-BSE-042", marks: { criteria1: 9, criteria2: 8, criteria3: 5, criteria4: 4 } },
      { name: "Hamza Tariq", roll: "FA20-BSE-058", marks: { criteria1: 8, criteria2: 8, criteria3: 4, criteria4: 4 } },
      { name: "Zainab Ali", roll: "FA20-BSE-019", marks: { criteria1: 9, criteria2: 9, criteria3: 5, criteria4: 4 } },
    ],
  },
  {
    group: "Group 08",
    title: "Autonomous Campus Shuttle Navigation",
    members: [
      { name: "Bilal Farooq", roll: "FA20-BCS-089", marks: { criteria1: 7, criteria2: 7, criteria3: 4, criteria4: 3 } },
      { name: "Sara Ahmed", roll: "FA20-BCS-112", marks: { criteria1: 8, criteria2: 7, criteria3: 4, criteria4: 3 } },
    ],
  },
  {
    group: "Group 21",
    title: "Smart Grid Load Balancer & Anomaly Detection",
    members: [
      { name: "Hassan Raza", roll: "FA20-BSE-103", marks: { criteria1: 9, criteria2: 9, criteria3: 5, criteria4: 5 } },
      { name: "Mariam Khan", roll: "FA20-BSE-077", marks: { criteria1: 9, criteria2: 8, criteria3: 4, criteria4: 4 } },
    ],
  },
];

export default function Evaluations() {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [groupsData, setGroupsData] = useState(evaluationGroups);
  const { addToast } = useToast();
  const [remarks, setRemarks] = useState(
    "Overall steady progress. Group 14 showed commendable empirical rigor in crop dataset processing."
  );

  const activeGroup = groupsData[selectedGroupIndex];

  const handleScoreChange = (memberIndex, criteriaKey, val) => {
    const num = Math.max(0, parseInt(val) || 0);
    const updated = [...groupsData];
    updated[selectedGroupIndex].members[memberIndex].marks[criteriaKey] = num;
    setGroupsData(updated);
  };

  const calculateTotal = (marksObj) => {
    return (marksObj.criteria1 || 0) + (marksObj.criteria2 || 0) + (marksObj.criteria3 || 0) + (marksObj.criteria4 || 0);
  };

    e.preventDefault();
    addToast(`Evaluation scores for ${activeGroup.group} submitted successfully.`);
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Evaluations & Marks"
        description="Authorized continuous evaluation portal. Record milestone grades and official rubric scores for your supervised student groups."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            Mid-Term Assessment Phase (30% Weightage)
          </span>
        }
      />

      {/* Select Group Tabs */}
      <div className="flex flex-wrap gap-2">
        {groupsData.map((g, idx) => (
          <button
            key={g.group}
            onClick={() => setSelectedGroupIndex(idx)}
            className={`px-4 py-2 rounded-[10px] text-[13px] font-bold transition-all cursor-pointer ${
              selectedGroupIndex === idx
                ? "bg-[#17302A] text-white shadow-sm"
                : "bg-white border border-[#E6E6E1] text-[#5F6B66] hover:bg-[#F4F4F2]"
            }`}
          >
            {g.group} • {g.title.slice(0, 24)}...
          </button>
        ))}
      </div>

      {/* Evaluation Rubric Card */}
      <form onSubmit={handleSaveMarks} className="space-y-6">
        <Card className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EEEEEA]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-0.5 rounded-full">
                {activeGroup.group}
              </span>
              <h2 className="font-['Bricolage_Grotesque'] text-[22px] font-bold text-[#17302A] mt-1">
                {activeGroup.title}
              </h2>
            </div>
            <span className="text-[13px] font-bold text-[#6B4700] bg-[#FEF3D6] px-3 py-1 rounded-full">
              Rubric Total: 30 Marks
            </span>
          </div>

          {/* Rubric Breakdown Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-[#FAFAF8] border border-[#EEEEEA] text-[12px]">
            <div>
              <span className="font-bold text-[#17302A]">1. Problem Formulation</span>
              <p className="text-[#5F6B66]">Literature depth, novelty (Max: 10)</p>
            </div>
            <div>
              <span className="font-bold text-[#17302A]">2. System Design</span>
              <p className="text-[#5F6B66]">SRS completeness, diagrams (Max: 10)</p>
            </div>
            <div>
              <span className="font-bold text-[#17302A]">3. Implementation Code</span>
              <p className="text-[#5F6B66]">Code modularity, repo tests (Max: 5)</p>
            </div>
            <div>
              <span className="font-bold text-[#17302A]">4. Defense & Q&A</span>
              <p className="text-[#5F6B66]">Oral defense presentation (Max: 5)</p>
            </div>
          </div>

          {/* Student Marks Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="border-b border-[#EEEEEA] text-[12px] uppercase font-semibold text-[#5F6B66]">
                <tr>
                  <th className="py-3">Student Name</th>
                  <th className="py-3">Formulation (10)</th>
                  <th className="py-3">Design (10)</th>
                  <th className="py-3">Code (5)</th>
                  <th className="py-3">Q&A (5)</th>
                  <th className="py-3 text-right">Total (30)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEA]">
                {activeGroup.members.map((member, mIdx) => {
                  const total = calculateTotal(member.marks);
                  return (
                    <tr key={member.roll} className="hover:bg-[#F9F9F8]">
                      <td className="py-4">
                        <div className="font-bold text-[#17302A]">{member.name}</div>
                        <div className="text-[12px] text-[#5F6B66]">{member.roll}</div>
                      </td>
                      <td className="py-4">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={member.marks.criteria1}
                          onChange={(e) => handleScoreChange(mIdx, "criteria1", e.target.value)}
                          className="w-16 rounded-[8px] border border-[#D3D8D4] p-1.5 text-center font-bold text-[#17302A]"
                        />
                      </td>
                      <td className="py-4">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={member.marks.criteria2}
                          onChange={(e) => handleScoreChange(mIdx, "criteria2", e.target.value)}
                          className="w-16 rounded-[8px] border border-[#D3D8D4] p-1.5 text-center font-bold text-[#17302A]"
                        />
                      </td>
                      <td className="py-4">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={member.marks.criteria3}
                          onChange={(e) => handleScoreChange(mIdx, "criteria3", e.target.value)}
                          className="w-16 rounded-[8px] border border-[#D3D8D4] p-1.5 text-center font-bold text-[#17302A]"
                        />
                      </td>
                      <td className="py-4">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={member.marks.criteria4}
                          onChange={(e) => handleScoreChange(mIdx, "criteria4", e.target.value)}
                          className="w-16 rounded-[8px] border border-[#D3D8D4] p-1.5 text-center font-bold text-[#17302A]"
                        />
                      </td>
                      <td className="py-4 text-right">
                        <span className="font-['Bricolage_Grotesque'] text-[18px] font-extrabold text-[#17302A]">
                          {total} / 30
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Supervisor Confidential Notes */}
          <div>
            <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
              Confidential Evaluation Remarks for FYP Coordinator
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-[10px] border border-[#D3D8D4] bg-white p-3 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6] resize-none"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#EEEEEA]">
            <span className="text-[12px] text-[#5F6B66]">
              Scores are recorded with cryptographic audit timestamps.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => addToast("Draft marks saved.")}
                className="px-4 py-2 rounded-[10px] border border-[#D3D8D4] text-[13px] font-bold text-[#17302A] hover:bg-gray-50 cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[13px] transition-colors shadow-sm cursor-pointer"
              >
                Submit Official Marks
              </button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
