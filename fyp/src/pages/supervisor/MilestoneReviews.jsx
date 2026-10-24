import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";
import { getMyProjects, getMilestones } from "../../services/api";

export default function MilestoneReviews() {
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [deptMilestones, setDeptMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [pData, mData] = await Promise.all([
        getMyProjects().catch(() => []),
        getMilestones().catch(() => []),
      ]);
      setProjects(pData || []);
      setDeptMilestones(mData || []);
    } catch (err) {
      console.error("Failed to load milestone review data:", err);
    } finally {
      setLoading(false);
    }
  }

  // Construct milestone review items from real projects and department milestones
  const milestones = [];
  let counter = 1;
  for (const p of projects) {
    for (const m of deptMilestones.slice(0, 3)) {
      const isCompleted = p.status?.includes("Approved") && m.order_index <= 2;
      const isInProgress = m.status === "Active" || (p.status?.includes("Approved") && m.order_index === 3);
      milestones.push({
        id: counter++,
        title: m.milestone,
        group: p.group_name,
        project: p.title,
        deadline: m.deadline,
        status: isCompleted ? "Completed" : (isInProgress ? "In Progress" : "Upcoming"),
        variant: isCompleted ? "green" : (isInProgress ? "amber" : "gray"),
        progress: isCompleted ? 100 : (isInProgress ? 70 : 20),
        submissions: isCompleted ? "Approved with minor remarks" : (isInProgress ? "Draft v1 uploaded for review" : "Awaiting submission"),
        overdue: false,
      });
    }
  }

  // Add cohort-wide milestone
  if (deptMilestones.length > 3) {
    const cohortMilestone = deptMilestones[3];
    milestones.push({
      id: counter++,
      title: cohortMilestone.milestone,
      group: "All Groups",
      project: "Cohort Milestone",
      deadline: cohortMilestone.deadline,
      status: cohortMilestone.status,
      variant: cohortMilestone.status === "Completed" ? "green" : (cohortMilestone.status === "Active" ? "amber" : "gray"),
      progress: cohortMilestone.status === "Completed" ? 100 : 0,
      submissions: "Rubric published by FYP Committee",
      overdue: false,
    });
  }

  const groups = ["All", ...Array.from(new Set(projects.map((p) => p.group_name))), "All Groups"];

  const filtered = milestones.filter((m) => {
    if (selectedGroup === "All") return true;
    return m.group === selectedGroup;
  });

  const handleUpdateStatus = (id, newStatus) => {
    addToast(`Milestone marked as '${newStatus}' for this student group.`);
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
                  onClick={() => addToast(`Opening milestone review notes for ${m.title}...`, "info")}
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
