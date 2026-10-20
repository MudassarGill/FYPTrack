import { useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";

const initialDeadlines = [
  {
    id: 1,
    milestone: "Project Proposal Defense",
    phase: "Phase 1",
    deadline: "20 Sep 2026",
    submissionWeight: "10%",
    status: "Completed",
    variant: "green",
    compliance: "48 / 48 Groups (100%)",
  },
  {
    id: 2,
    milestone: "Software Requirements Specification (SRS)",
    phase: "Phase 2",
    deadline: "10 Oct 2026",
    submissionWeight: "15%",
    status: "Completed",
    variant: "green",
    compliance: "48 / 48 Groups (100%)",
  },
  {
    id: 3,
    milestone: "System Design Document & Architecture",
    phase: "Phase 3",
    deadline: "12 Nov 2026",
    submissionWeight: "15%",
    status: "Active",
    variant: "amber",
    compliance: "26 / 48 Groups Submitted",
  },
  {
    id: 4,
    milestone: "Mid-Term Progress Defense",
    phase: "Phase 4",
    deadline: "20 Dec 2026",
    submissionWeight: "20%",
    status: "Upcoming",
    variant: "gray",
    compliance: "Rubric Published",
  },
  {
    id: 5,
    milestone: "Prototype Demonstration & Code Freeze",
    phase: "Phase 5",
    deadline: "15 Mar 2027",
    submissionWeight: "20%",
    status: "Upcoming",
    variant: "gray",
    compliance: "Pending Phase",
  },
  {
    id: 6,
    milestone: "Final Dissertation & External Defense",
    phase: "Phase 6",
    deadline: "25 May 2027",
    submissionWeight: "20%",
    status: "Upcoming",
    variant: "gray",
    compliance: "Final Gate",
  },
];

export default function DeadlinesMilestones() {
  const [deadlines, setDeadlines] = useState(initialDeadlines);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [newDate, setNewDate] = useState("");

  const handleUpdateDeadline = (e) => {
    e.preventDefault();
    setDeadlines(
      deadlines.map((d) => (d.id === editingMilestone.id ? { ...d, deadline: newDate } : d))
    );
    setEditingMilestone(null);
    setNewDate("");
    alert("Department academic milestone deadline updated and broadcast dispatched!");
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Department Academic Calendar & Deadlines"
        description="Set and publish department-wide milestones, lock submission dates, and track cohort compliance rates."
        action={
          <button
            type="button"
            onClick={() => alert("Broadcasting reminder to all 142 students and 18 supervisors...")}
            className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[13px] px-4 py-2 transition-colors shadow-sm cursor-pointer"
          >
            📢 Broadcast Milestone Reminder
          </button>
        }
      />

      <div className="space-y-4">
        {deadlines.map((d) => (
          <Card key={d.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#EEEEEA]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#17302A] text-white">
                    {d.phase}
                  </span>
                  <span className="text-[12px] font-semibold text-[#0B5A3E] bg-[#E1F4EA] px-2 py-0.5 rounded">
                    Weightage: {d.submissionWeight}
                  </span>
                </div>
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                  {d.milestone}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[11px] text-[#5F6B66]">Official Deadline</div>
                  <div className="font-bold text-[15px] text-[#17302A]">{d.deadline}</div>
                </div>
                <Badge variant={d.variant} size="sm">
                  {d.status}
                </Badge>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[13px] text-[#5F6B66]">
                <strong>Department Compliance: </strong>
                {d.compliance}
              </span>

              <button
                type="button"
                onClick={() => {
                  setEditingMilestone(d);
                  setNewDate(d.deadline);
                }}
                className="rounded-[8px] bg-[#EEEEEA] hover:bg-[#E0E0DC] text-[#17302A] text-[12px] font-bold px-3.5 py-1.5 transition-colors cursor-pointer"
              >
                Modify Deadline
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Deadline Modal */}
      {editingMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full shadow-2xl space-y-4 border border-[#E6E6E1]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-0.5 rounded-full">
                  {editingMilestone.phase}
                </span>
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mt-1">
                  Adjust Deadline: {editingMilestone.milestone}
                </h3>
              </div>
              <button
                onClick={() => setEditingMilestone(null)}
                className="text-[#5F6B66] hover:text-[#17302A] text-[20px] font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateDeadline} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                  New Deadline Date
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 18 Nov 2026"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-[10px] border border-[#D3D8D4] bg-white p-2.5 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="px-4 py-2 rounded-[10px] border border-[#D3D8D4] text-[13px] font-bold text-[#5F6B66] hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[10px] bg-[#17302A] hover:bg-[#24493F] text-white text-[13px] font-bold transition-colors cursor-pointer"
                >
                  Publish New Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
