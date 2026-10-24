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
  const [milestonesList, setMilestonesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [inspectionTarget, setInspectionTarget] = useState(null);

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
      const validProjects = pData || [];
      const validMilestones = mData || [];
      setProjects(validProjects);
      setDeptMilestones(validMilestones);
      buildMilestones(validProjects, validMilestones);
    } catch (err) {
      console.error("Failed to load milestone review data:", err);
    } finally {
      setLoading(false);
    }
  }

  function buildMilestones(projList, msList) {
    const savedSignOffs = JSON.parse(
      localStorage.getItem("fyptrack_milestone_signoffs") || "{}"
    );

    const items = [];
    let counter = 1;

    for (const p of projList) {
      for (const m of msList.slice(0, 3)) {
        const uniqueKey = `${p.id || p.group_name}_${m.order_index || m.id}`;
        const isManuallyCompleted = Boolean(savedSignOffs[uniqueKey]);
        const isCompletedByDefault =
          p.status?.includes("Approved") && m.order_index <= 2;
        const isCompleted = isManuallyCompleted || isCompletedByDefault;
        const isInProgress =
          !isCompleted &&
          (m.status === "Active" ||
            (p.status?.includes("Approved") && m.order_index === 3));

        items.push({
          id: counter++,
          uniqueKey,
          title: m.milestone,
          group: p.group_name,
          project: p.title,
          deadline: m.deadline,
          status: isCompleted
            ? "Completed"
            : isInProgress
            ? "In Progress"
            : "Upcoming",
          variant: isCompleted ? "green" : isInProgress ? "amber" : "gray",
          progress: isCompleted ? 100 : isInProgress ? 70 : 20,
          submissions: isCompleted
            ? "Certified and approved by supervisor"
            : isInProgress
            ? "Draft v1 uploaded for review"
            : "Awaiting submission",
          overdue: false,
          signedDate: savedSignOffs[uniqueKey]?.signedAt || null,
        });
      }
    }

    // Add cohort-wide milestone
    if (msList.length > 3) {
      const cohortMilestone = msList[3];
      const uniqueKey = `cohort_${cohortMilestone.order_index || cohortMilestone.id}`;
      const isManuallyCompleted = Boolean(savedSignOffs[uniqueKey]);
      const isCompleted =
        isManuallyCompleted || cohortMilestone.status === "Completed";
      const isInProgress = !isCompleted && cohortMilestone.status === "Active";

      items.push({
        id: counter++,
        uniqueKey,
        title: cohortMilestone.milestone,
        group: "All Groups",
        project: "Cohort Milestone",
        deadline: cohortMilestone.deadline,
        status: isCompleted
          ? "Completed"
          : isInProgress
          ? "In Progress"
          : "Upcoming",
        variant: isCompleted ? "green" : isInProgress ? "amber" : "gray",
        progress: isCompleted ? 100 : isInProgress ? 50 : 0,
        submissions: "Rubric published by FYP Committee",
        overdue: false,
        signedDate: savedSignOffs[uniqueKey]?.signedAt || null,
      });
    }

    setMilestonesList(items);
  }

  const groups = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.group_name))),
    "All Groups",
  ];

  const filtered = milestonesList.filter((m) => {
    if (selectedGroup === "All") return true;
    return m.group === selectedGroup;
  });

  const handleUpdateStatus = (id, newStatus) => {
    const target = milestonesList.find((m) => m.id === id);
    if (!target) return;

    const todayStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const savedSignOffs = JSON.parse(
      localStorage.getItem("fyptrack_milestone_signoffs") || "{}"
    );
    savedSignOffs[target.uniqueKey] = {
      status: newStatus,
      signedAt: todayStr,
    };
    localStorage.setItem(
      "fyptrack_milestone_signoffs",
      JSON.stringify(savedSignOffs)
    );

    setMilestonesList((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const isDone = newStatus === "Completed";
          return {
            ...m,
            status: newStatus,
            variant: isDone ? "green" : "amber",
            progress: isDone ? 100 : 70,
            submissions: isDone
              ? "Certified and approved by supervisor"
              : m.submissions,
            signedDate: todayStr,
          };
        }
        return m;
      })
    );

    addToast(
      `Milestone '${target.title}' marked as '${newStatus}' for ${target.group}. Progress updated to 100%!`,
      "success"
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Milestone Reviews"
        description="Monitor phase-wise progress across all supervised groups, identify overdue deliverables, and certify milestones."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            {milestonesList.filter((m) => m.overdue).length} Overdue Attention Required
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

      {loading ? (
        <div className="card-base text-center py-12 text-[#5F6B66]">
          Loading milestone reviews...
        </div>
      ) : (
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
                  {m.signedDate && (
                    <div className="text-[11px] text-[#0B5A3E] font-medium mt-0.5">
                      Certified on: {m.signedDate}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="font-medium text-[#5F6B66]">Milestone Progress</span>
                    <span className="font-bold text-[#17302A]">{m.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#E6E9E6] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        m.overdue
                          ? "bg-red-600"
                          : m.progress === 100
                          ? "bg-[#0B5A3E]"
                          : "bg-[#17302A]"
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
                  {m.status !== "Completed" ? (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(m.id, "Completed")}
                      className="rounded-[8px] bg-[#0B5A3E] hover:bg-[#094731] text-white text-[12px] font-bold px-3 py-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      Mark Completed
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-[8px] bg-[#E1F4EA] text-[#0B5A3E] text-[12px] font-bold px-3 py-1.5 border border-[#BDE8D3]">
                      Certified Completed
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectionTarget(m);
                    }}
                    className="rounded-[8px] bg-[#EEEEEA] hover:bg-[#E0E0DC] text-[#17302A] text-[12px] font-bold px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    Inspection Log
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Inspection Log Modal */}
      {inspectionTarget && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          onClick={() => setInspectionTarget(null)}
        >
          <div
            className="bg-white rounded-[20px] p-6 max-w-lg w-full shadow-2xl space-y-4 border border-[#E6E6E1]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-[#EEEEEA]">
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#17302A] text-white">
                  {inspectionTarget.group}
                </span>
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mt-1">
                  Inspection Log: {inspectionTarget.title}
                </h3>
                <p className="text-[12px] text-[#5F6B66]">{inspectionTarget.project}</p>
              </div>
              <button
                onClick={() => setInspectionTarget(null)}
                className="text-[#5F6B66] hover:text-[#17302A] text-[20px] font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-[13px]">
              <div className="bg-[#FAFAF8] p-3 rounded-lg border border-[#EEEEEA] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#5F6B66]">Official Stage:</span>
                  <span className="font-bold text-[#17302A]">{inspectionTarget.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5F6B66]">Deadline:</span>
                  <span className="font-semibold text-[#17302A]">{inspectionTarget.deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5F6B66]">Current Status:</span>
                  <Badge variant={inspectionTarget.variant} size="sm">
                    {inspectionTarget.status} ({inspectionTarget.progress}%)
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#17302A] text-[13px]">Deliverable Audit Checklist</h4>
                <div className="space-y-1.5 text-[12px]">
                  <div className="flex items-center gap-2 p-2 rounded bg-[#E1F4EA] text-[#0B5A3E] font-medium">
                    <span>Active Submission:</span>
                    <strong className="truncate">{inspectionTarget.group}_Deliverable_v1.pdf</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-gray-50 text-[#17302A]">
                    <span>Originality & Anti-Plagiarism:</span>
                    <strong className="text-[#0B5A3E]">96.4% Unique (Passed)</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-gray-50 text-[#17302A]">
                    <span>Supervisor Architectural Sign-off:</span>
                    <strong className={inspectionTarget.status === "Completed" ? "text-[#0B5A3E]" : "text-amber-700"}>
                      {inspectionTarget.status === "Completed" ? "Certified Approved" : "Pending Supervisor Action"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#EEEEEA]">
              <button
                type="button"
                onClick={() => setInspectionTarget(null)}
                className="px-4 py-2 rounded-[10px] border border-[#D3D8D4] text-[13px] font-bold text-[#5F6B66] hover:bg-gray-50 cursor-pointer"
              >
                Close Log
              </button>
              {inspectionTarget.status !== "Completed" && (
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(inspectionTarget.id, "Completed");
                    setInspectionTarget(null);
                  }}
                  className="px-4 py-2 rounded-[10px] bg-[#0B5A3E] hover:bg-[#094731] text-white text-[13px] font-bold transition-colors cursor-pointer"
                >
                  Certify & Mark Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
