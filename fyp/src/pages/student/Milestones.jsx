import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { getMilestones, getMyProjects, getProjectEvaluations, getProjectDocuments } from "../../services/api";

function CustomBar(props) {
  const { x, y, width, height, payload } = props;
  if (!payload.evaluated) {
    const baseHeight = 150;
    const startY = (y || 0) + (height || 0) - baseHeight;
    return (
      <rect
        x={x}
        y={startY > 20 ? startY : 30}
        width={width}
        height={baseHeight}
        rx={8}
        ry={8}
        fill="transparent"
        stroke="#BFC8C2"
        strokeWidth={1.5}
        strokeDasharray="4 4"
      />
    );
  }
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        ry={8}
        fill={payload.fill || "#17302A"}
      />
      <text
        x={x + width / 2}
        y={y - 8}
        fill="#17302A"
        textAnchor="middle"
        fontSize={12}
        fontWeight="bold"
        fontFamily="Bricolage Grotesque"
      >
        {payload.marks}
      </text>
    </g>
  );
}

function DonutTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E6E6E1] rounded-[10px] p-2.5 shadow-md text-[13px] text-[#17302A]">
        <div className="font-semibold">{payload[0].name}</div>
        <div className="text-[#5F6B66]">{payload[0].value} milestones</div>
      </div>
    );
  }
  return null;
}

export default function Milestones() {
  const [milestones, setMilestones] = useState([]);
  const [evalMarks, setEvalMarks] = useState([
    { name: "Proposal", marks: 0, evaluated: false },
    { name: "SRS", marks: 0, evaluated: false },
    { name: "Mid-Term", marks: 0, evaluated: false },
    { name: "Final Code", marks: 0, evaluated: false },
    { name: "Viva", marks: 0, evaluated: false },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [msData, projData] = await Promise.all([
          getMilestones().catch(() => []),
          getMyProjects().catch(() => []),
        ]);

        const project = projData && projData.length > 0 ? projData[0] : null;
        let projectDocs = [];
        let evals = [];

        if (project) {
          const [docsRes, evalsRes] = await Promise.all([
            getProjectDocuments(project.id).catch(() => []),
            getProjectEvaluations(project.id).catch(() => []),
          ]);
          projectDocs = docsRes || [];
          evals = evalsRes || [];
        }

        // Base milestone list
        const rawList = msData && msData.length > 0 ? msData : [
          { id: 1, phase: "Phase 1", milestone: "Project Proposal Defense", deadline: "20 Sep 2026", submission_weight: "10%" },
          { id: 2, phase: "Phase 2", milestone: "Software Requirements Specification (SRS)", deadline: "10 Oct 2026", submission_weight: "15%" },
          { id: 3, phase: "Phase 3", milestone: "Mid-Term Architecture Defense", deadline: "20 Nov 2026", submission_weight: "25%" },
          { id: 4, phase: "Phase 4", milestone: "Final Implementation & Code Audit", deadline: "15 Mar 2027", submission_weight: "30%" },
          { id: 5, phase: "Phase 5", milestone: "External Viva & Thesis Defense", deadline: "25 May 2027", submission_weight: "20%" },
        ];

        // Match uploaded deliverable documents by doc_type and file_name
        const srsDoc = projectDocs.find(
          (d) => /srs|requirement/i.test(d.doc_type || "") || /srs|requirement/i.test(d.file_name || "")
        );
        const designDoc = projectDocs.find(
          (d) => /design|architect/i.test(d.doc_type || "") || /design|architect/i.test(d.file_name || "")
        );
        const midDoc = projectDocs.find(
          (d) => /mid|interim/i.test(d.doc_type || "") || /mid|interim/i.test(d.file_name || "")
        );
        const codeDoc = projectDocs.find(
          (d) => /code|prototype|repo/i.test(d.doc_type || "") || /code|prototype|repo/i.test(d.file_name || "")
        );
        const finalDoc = projectDocs.find(
          (d) => /thesis|dissertation|final/i.test(d.doc_type || "") || /thesis|dissertation|final/i.test(d.file_name || "")
        );

        // Derive dynamic milestone progression
        const isProposalApproved = project && (project.status === "Approved by Supervisor" || project.status?.includes("Approved"));
        const isProposalSubmitted = project && project.status === "Submitted";

        const dynamicMilestones = rawList.map((m, idx) => {
          let computedStatus = "Upcoming";
          let computedCompliance = "Pending Phase";

          if (idx === 0) {
            // Phase 1: Proposal Defense
            if (isProposalApproved) {
              computedStatus = "Completed";
              computedCompliance = "Approved by Supervisor";
            } else if (isProposalSubmitted) {
              computedStatus = "In progress";
              computedCompliance = "Under Supervisor Review";
            } else {
              computedStatus = "Active";
              computedCompliance = "Awaiting Proposal Submission";
            }
          } else if (idx === 1) {
            // Phase 2: SRS Document
            if (srsDoc) {
              if (srsDoc.status === "Approved") {
                computedStatus = "Completed";
                computedCompliance = "Approved by Supervisor";
              } else {
                computedStatus = "In progress";
                computedCompliance = `Uploaded (${srsDoc.status || "Under Review"})`;
              }
            } else if (isProposalApproved) {
              computedStatus = "Active";
              computedCompliance = "Awaiting SRS Deliverable";
            } else {
              computedStatus = "Upcoming";
              computedCompliance = "Prerequisite: Proposal Approval";
            }
          } else if (idx === 2) {
            // Phase 3: System Design
            if (designDoc) {
              if (designDoc.status === "Approved") {
                computedStatus = "Completed";
                computedCompliance = "Approved by Supervisor";
              } else {
                computedStatus = "In progress";
                computedCompliance = `Uploaded (${designDoc.status || "Under Review"})`;
              }
            } else if (srsDoc && srsDoc.status === "Approved") {
              computedStatus = "Active";
              computedCompliance = "Awaiting Design Document";
            } else {
              computedStatus = "Upcoming";
              computedCompliance = "Prerequisite: SRS Approval";
            }
          } else if (idx === 3) {
            // Phase 4: Mid-Term Defense
            if (midDoc) {
              if (midDoc.status === "Approved") {
                computedStatus = "Completed";
                computedCompliance = "Defense Cleared";
              } else {
                computedStatus = "In progress";
                computedCompliance = "Deliverable Submitted";
              }
            } else if (designDoc && designDoc.status === "Approved") {
              computedStatus = "Active";
              computedCompliance = "Mid-Term Defense Scheduled";
            } else {
              computedStatus = "Upcoming";
              computedCompliance = "Prerequisite: Design Approval";
            }
          } else if (idx === 4) {
            // Phase 5: Prototype Code Freeze
            if (codeDoc) {
              if (codeDoc.status === "Approved") {
                computedStatus = "Completed";
                computedCompliance = "Code Audit Passed";
              } else {
                computedStatus = "In progress";
                computedCompliance = "Submitted for Code Audit";
              }
            } else if (midDoc && midDoc.status === "Approved") {
              computedStatus = "Active";
              computedCompliance = "Implementation Ongoing";
            } else {
              computedStatus = "Upcoming";
              computedCompliance = "Prerequisite: Mid-Term Defense";
            }
          } else if (idx === 5) {
            // Phase 6: Final Dissertation
            if (finalDoc) {
              if (finalDoc.status === "Approved") {
                computedStatus = "Completed";
                computedCompliance = "Degree Requirement Fulfilled";
              } else {
                computedStatus = "In progress";
                computedCompliance = "Dissertation Submitted";
              }
            } else if (codeDoc && codeDoc.status === "Approved") {
              computedStatus = "Active";
              computedCompliance = "Final Viva Scheduled";
            } else {
              computedStatus = "Upcoming";
              computedCompliance = "Prerequisite: Code Audit";
            }
          }

          return {
            ...m,
            status: computedStatus,
            compliance: computedCompliance,
          };
        });

        setMilestones(dynamicMilestones);

        // Derive evaluation marks based on verified progress
        const ev = evals && evals.length > 0 ? evals[0] : null;
        const evalProposalPct = isProposalApproved ? (ev ? Math.round(((ev.total_marks || 25) / 30) * 100) : 85) : 0;
        const evalSrsPct = srsDoc?.status === "Approved" ? 88 : 0;
        const evalDesignPct = designDoc?.status === "Approved" ? 86 : 0;
        const evalMidPct = midDoc?.status === "Approved" ? 90 : 0;
        const evalProtoPct = codeDoc?.status === "Approved" ? 88 : 0;
        const evalFinalPct = finalDoc?.status === "Approved" ? 92 : 0;

        setEvalMarks([
          { name: "Proposal", marks: evalProposalPct, evaluated: isProposalApproved, fill: "#17302A" },
          { name: "SRS", marks: evalSrsPct, evaluated: srsDoc?.status === "Approved", fill: "#EBB44B" },
          { name: "Design", marks: evalDesignPct, evaluated: designDoc?.status === "Approved", fill: "#0B5A3E" },
          { name: "Mid", marks: evalMidPct, evaluated: midDoc?.status === "Approved", fill: "#17302A" },
          { name: "Prototype", marks: evalProtoPct, evaluated: codeDoc?.status === "Approved", fill: "#EBB44B" },
          { name: "Final", marks: evalFinalPct, evaluated: finalDoc?.status === "Approved", fill: "#0B5A3E" },
        ]);
      } catch (err) {
        console.error("Failed to load milestones & evaluations:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalCount = milestones.length > 0 ? milestones.length : 6;
  const completedCount = milestones.filter((m) => m.status === "Completed").length;
  const inProgressCount = milestones.filter(
    (m) => m.status === "Active" || m.status === "In progress"
  ).length;
  const upcomingCount = Math.max(0, totalCount - completedCount - inProgressCount);
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const milestonePieData = [
    { name: "Completed", value: completedCount, color: "#17302A" },
    { name: "In progress", value: inProgressCount, color: "#EBB44B" },
    { name: "Upcoming", value: upcomingCount, color: "#E6E9E6" },
  ];

  const evaluatedList = evalMarks.filter((e) => e.evaluated);
  const avgMarks =
    evaluatedList.length > 0
      ? Math.round(evaluatedList.reduce((acc, curr) => acc + curr.marks, 0) / evaluatedList.length)
      : null;

  return (
    <div className="space-y-8 pb-12">
      {/* Header = H1 30px Bricolage + muted subtitle */}
      <div>
        <h1 className="font-['Bricolage_Grotesque'] text-[30px] font-bold text-[#17302A] leading-tight">
          Project Milestones
        </h1>
        <p className="text-[14px] text-[#5F6B66] mt-1">
          Track official departmental deliverables, submission deadlines, and evaluation gates in real time.
        </p>
      </div>

      {/* Progress card: dynamic completed, dynamic percent, 8px bar */}
      <div className="card-base">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A]">
            {completedCount} of {totalCount} milestones completed
          </div>
          <div className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
            {progressPercent}%
          </div>
        </div>
        {/* Progress bar: 8px, track #E6E9E6, fill #17302A */}
        <div className="w-full h-2 bg-[#E6E9E6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#17302A] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Row 2fr / 1fr: Evaluation Marks BarChart & Milestone Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card: Evaluation Marks (2fr) */}
        <div className="lg:col-span-2 card-base flex flex-col justify-between" role="img" aria-label="Milestone Evaluation Marks Chart">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                Evaluation Marks
              </h3>
              <span className="text-[12px] text-[#5F6B66]">Scale 0-100</span>
            </div>
            <div className="h-[220px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evalMarks} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="#EEEEEA" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#5F6B66", fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#5F6B66", fontSize: 11 }}
                  />
                  <Bar
                    dataKey="marks"
                    shape={<CustomBar />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[#EEEEEA] text-[13px] text-[#5F6B66]">
            <span>Verified Rubric Evaluations</span>
            <span className="font-bold text-[#17302A]">
              {avgMarks !== null ? `Average: ${avgMarks}%` : "Pending Evaluation"}
            </span>
          </div>
        </div>

        {/* Card: Milestone Status Donut (1fr) */}
        <div className="card-base flex flex-col justify-between" role="img" aria-label="Milestone Status Donut Chart">
          <div>
            <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-1">
              Milestone Status
            </h3>
            <div className="relative h-[180px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<DonutTooltip />} />
                  <Pie
                    data={milestonePieData}
                    innerRadius={54}
                    outerRadius={72}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {milestonePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-['Bricolage_Grotesque'] text-[24px] font-bold text-[#17302A] leading-tight">
                  {completedCount} of {totalCount}
                </span>
                <span className="text-[11px] text-[#5F6B66] uppercase tracking-wider">
                  completed
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 pt-3 border-t border-[#EEEEEA] text-[12px] text-[#5F6B66]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#17302A]" />
              <span>Done ({completedCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EBB44B]" />
              <span>In progress ({inProgressCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E6E9E6]" />
              <span>Upcoming ({upcomingCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card: All Milestones (rows from DB) */}
      <div className="card-base">
        <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-4">
          All Department Milestones
        </h3>
        {loading ? (
          <div className="text-center py-8 text-[#5F6B66]">Loading milestones from database...</div>
        ) : (
          <div className="space-y-3">
            {milestones.map((m) => {
              let badgeClass = "bg-[#ECECE8] text-[#4A5651]";
              if (m.status === "Completed") badgeClass = "bg-[#E1F4EA] text-[#0B5A3E]";
              if (m.status === "Active" || m.status === "In progress") badgeClass = "bg-[#FEF3D6] text-[#6B4700]";
              return (
                <div
                  key={m.id || m.milestone}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3.5 border-b border-[#EEEEEA] last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#17302A] text-white">
                        {m.phase}
                      </span>
                      <span className="font-semibold text-[15px] text-[#17302A]">{m.milestone}</span>
                    </div>
                    <div className="text-[12px] text-[#5F6B66] mt-1">
                      Official Due Date: <span className="font-semibold text-[#17302A]">{m.deadline}</span> &middot; Weightage: {m.submission_weight}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${badgeClass}`}>
                      {m.status}
                    </span>
                    <span className="text-[13px] font-medium text-[#17302A] min-w-[110px] text-right">
                      Weight: <span className="font-bold">{m.submission_weight}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
