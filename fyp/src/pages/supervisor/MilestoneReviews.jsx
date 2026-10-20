import { useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";

const initialMilestones = [
  {
    id: 1,
    title: "Project Proposal Defense",
    group: "Group 14",
    project: "Crop Price Prediction System",
    deadline: "20 Sep 2026",
    status: "Completed",
    variant: "green",
    progress: 100,
    submissions: "Approved with minor remarks",
    overdue: false,
  },
  {
    id: 2,
    title: "Software Requirements Specification (SRS)",
    group: "Group 14",
    project: "Crop Price Prediction System",
    deadline: "10 Oct 2026",
    status: "Completed",
    variant: "green",
    progress: 100,
    submissions: "SRS v2.1 accepted",
    overdue: false,
  },
  {
    id: 3,
    title: "System Design Document",
    group: "Group 14",
    project: "Crop Price Prediction System",
    deadline: "12 Nov 2026",
    status: "In Progress",
    variant: "amber",
    progress: 70,
    submissions: "Draft v1 uploaded for initial review",
    overdue: false,
  },
  {
    id: 4,
    title: "Hardware Sensor Calibration Benchmark",
    group: "Group 08",
    project: "Autonomous Campus Shuttle Navigation",
    deadline: "18 Oct 2026",
    status: "Overdue",
    variant: "gray",
    progress: 40,
    submissions: "Submission overdue by 2 days",
    overdue: true,
  },
  {
    id: 5,
    title: "Prototype Demonstration",
    group: "Group 21",
    project: "Smart Grid Load Balancer",
    deadline: "05 Dec 2026",
    status: "In Progress",
    variant: "amber",
    progress: 60,
    submissions: "Firmware code submitted, live bench test scheduled",
    overdue: false,
  },
  {
    id: 6,
    title: "Mid-Term Evaluation Defense",
    group: "All Groups",
    project: "Cohort Milestone",
    deadline: "20 Dec 2026",
    status: "Upcoming",
    variant: "gray",
    progress: 0,
    submissions: "Rubric published by FYP Committee",
    overdue: false,
  },
];

export default function MilestoneReviews() {
  const [milestones, setMilestones] = useState(initialMilestones);
  const [selectedGroup, setSelectedGroup] = useState("All");

  const groups = ["All", "Group 14", "Group 08", "Group 21", "All Groups"];

  const filtered = milestones.filter((m) => {
    if (selectedGroup === "All") return true;
    return m.group === selectedGroup;
  });

  const handleUpdateStatus = (id, newStatus) => {
    setMilestones(
      milestones.map((m) =>
        m.id === id
          ? {
              ...m,
              status: newStatus,
              variant: newStatus === "Completed" ? "green" : newStatus === "In Progress" ? "amber" : "gray",
              overdue: false,
              progress: newStatus === "Completed" ? 100 : m.progress,
            }
          : m
      )
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Milestone Reviews"
        description="Monitor phase-wise progress across all supervised groups, identify overdue deliverables, and certify milestones."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            {milestones.filter((m) => m.overdue).length} Overdue Attention Required
          </span>
        }
      />

      {/* Filter by Group */}
      <div className="flex flex-wrap gap-2">
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGroup(g)}
            className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-semibold transition-colors cursor-pointer ${
              selectedGroup === g
                ? "bg-[#17302A] text-white"
                : "bg-white border border-[#E6E6E1] text-[#5F6B66] hover:bg-[#F4F4F2]"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Milestones Cards List */}
      <div className="space-y-4">
        {filtered.map((m) => (
          <Card
            key={m.id}
            className={`p-6 ${m.overdue ? "border-red-300 bg-red-50/20" : ""}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#EEEEEA]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-bold px-2 py-0.5 rounded bg-[#17302A] text-white">
                    {m.group}
                  </span>
                  <span className="text-[12px] text-[#5F6B66]">{m.project}</span>
                </div>
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                  {m.title}
                </h3>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[12px] font-medium text-[#5F6B66]">
                  Due: <strong className="text-[#17302A]">{m.deadline}</strong>
                </span>
                <Badge variant={m.overdue ? "gray" : m.variant} size="sm">
                  {m.status}
                </Badge>
              </div>
            </div>

            <div className="py-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]">
              <div>
                <span className="font-semibold text-[#17302A]">Latest Deliverable: </span>
                <span className={m.overdue ? "text-red-700 font-medium" : "text-[#5F6B66]"}>
                  {m.submissions}
                </span>
              </div>

              <div className="md:col-span-2">
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="font-medium text-[#5F6B66]">Milestone Progress</span>
                  <span className="font-bold text-[#17302A]">{m.progress}%</span>
                </div>
                <div className="h-2 w-full bg-[#E6E9E6] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      m.overdue ? "bg-red-600" : "bg-[#17302A]"
                    }`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEEEA]">
              <span className="text-[12px] text-[#5F6B66]">
                Supervisor Milestone Sign-Off Authority
              </span>

              <div className="flex items-center gap-2">
                {m.status !== "Completed" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(m.id, "Completed")}
                    className="rounded-[8px] bg-[#0B5A3E] hover:bg-[#094731] text-white text-[12px] font-bold px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    Mark Completed &times;
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => alert(`Opening milestone review notes for ${m.title}`)}
                  className="rounded-[8px] bg-[#EEEEEA] hover:bg-[#E0E0DC] text-[#17302A] text-[12px] font-bold px-3 py-1.5 transition-colors cursor-pointer"
                >
                  Inspection Log
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
