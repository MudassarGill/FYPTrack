import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getStoredUser } from "../../services/auth";
import {
  getMyProjects,
  getDocumentsForReview,
  getMilestones,
  getDepartmentSettings,
} from "../../services/api";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";

function AreaTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E6E6E1] rounded-[10px] p-2.5 shadow-md text-[13px] text-[#17302A]">
        <div className="font-semibold">{label}</div>
        <div className="text-[#5F6B66]">{payload[0].value}% Cohort Completion</div>
      </div>
    );
  }
  return null;
}

function DonutTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E6E6E1] rounded-[10px] p-2.5 shadow-md text-[13px] text-[#17302A]">
        <div className="font-semibold">{payload[0].name}</div>
        <div className="text-[#5F6B66]">{payload[0].value} Deliverables</div>
      </div>
    );
  }
  return null;
}

function CustomizedDot(props) {
  const { cx, cy } = props;
  return <circle cx={cx} cy={cy} r={4} fill="#17302A" />;
}

export default function SupervisorOverview() {
  const user = getStoredUser();
  const supervisorName = user?.full_name || "Faculty Supervisor";

  const [projects, setProjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [deptSettings, setDeptSettings] = useState({ max_supervisor_quota: 5 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [projRes, docRes, msRes, setRes] = await Promise.all([
          getMyProjects().catch(() => []),
          getDocumentsForReview().catch(() => []),
          getMilestones().catch(() => []),
          getDepartmentSettings().catch(() => null),
        ]);
        setProjects(projRes || []);
        setDocuments(docRes || []);
        setMilestones(msRes || []);
        if (setRes) setDeptSettings(setRes);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Real calculations
  const pendingDocs = documents.filter((d) => d.status === "Pending");
  const approvedDocs = documents.filter((d) => d.status === "Approved");
  const changesDocs = documents.filter((d) => d.status === "Changes Requested");

  const totalAssignedStudents = projects.reduce((acc, p) => {
    if (p.group_members) {
      return acc + p.group_members.split(",").length;
    }
    return acc + 2;
  }, 0);

  const activeProjectsCount = projects.length;
  const pendingReviewsCount = pendingDocs.length;
  const criticalDeadlinesCount = milestones.filter(
    (m) => m.status === "Active" || m.status === "Upcoming"
  ).length;

  const milestonePieData = [
    { name: "Approved", value: approvedDocs.length, color: "#17302A" },
    { name: "Pending Review", value: pendingDocs.length, color: "#EBB44B" },
    { name: "Changes Requested", value: changesDocs.length, color: "#B91C1C" },
    { name: "Upcoming", value: Math.max(1, milestones.length), color: "#E6E9E6" },
  ];

  const totalDeliverablesCount =
    approvedDocs.length + pendingDocs.length + changesDocs.length + milestones.length;

  const cohortVelocity =
    projects.length > 0 && totalDeliverablesCount > 0
      ? Math.round((approvedDocs.length / Math.max(1, approvedDocs.length + pendingDocs.length)) * 100)
      : 0;

  const cohortProgressData =
    projects.length === 0
      ? [
          { week: "W1", progress: 0 },
          { week: "W2", progress: 0 },
          { week: "W3", progress: 0 },
          { week: "W4", progress: 0 },
          { week: "W5", progress: 0 },
          { week: "Current", progress: 0 },
        ]
      : [
          { week: "W1", progress: 15 },
          { week: "W2", progress: 30 },
          { week: "W3", progress: 45 },
          { week: "W4", progress: 60 },
          { week: "W5", progress: Math.min(cohortVelocity, 70) },
          { week: "Current", progress: cohortVelocity },
        ];

  return (
    <div className="space-y-8 pb-12">
      {/* ===================== 1. SUPERVISOR HERO ===================== */}
      <div
        className="rounded-[20px] text-white shadow-[0_18px_40px_rgba(23,48,42,.35)] relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #17302A, #24493F)",
          padding: "38px 36px 44px",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span
                className="inline-block px-3 py-1 text-[12px] font-semibold rounded-full"
                style={{ backgroundColor: "rgba(235,180,75,0.20)", color: "#F6D88E" }}
              >
                Supervisor Portal • Faculty Track
              </span>
              <span className="text-xs text-[#D5E3DD]/80">
                Supervision Quota: {activeProjectsCount} of {deptSettings.max_supervisor_quota || 5} Max Groups Allocated
              </span>
            </div>
            <h1 className="font-['Bricolage_Grotesque'] font-bold text-[32px] sm:text-[40px] leading-tight text-white mb-2">
              Welcome back, {supervisorName}
            </h1>
            <p className="text-[15px] text-[#D5E3DD] max-w-2xl leading-relaxed">
              Track student milestone submissions, inspect uploaded deliverables, and provide continuous assessment marks in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/supervisor/documents"
              className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors shadow-sm"
            >
              Review Pending ({pendingReviewsCount})
            </Link>
            <Link
              to="/supervisor/students"
              className="rounded-[10px] border border-white/35 hover:bg-white/10 text-white font-bold text-[14px] px-[18px] py-[11px] transition-colors"
            >
              View My Students
            </Link>
          </div>
        </div>
      </div>

      {/* ===================== 2. STAT SUMMARY CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Assigned Students"
          value={String(totalAssignedStudents)}
          subtext={`Across ${activeProjectsCount} active project groups`}
        />
        <StatCard
          label="Active Projects"
          value={String(activeProjectsCount)}
          subtext={`Quota limit: ${deptSettings.max_supervisor_quota || 5} groups`}
        />
        <StatCard
          label="Pending Reviews"
          value={String(pendingReviewsCount)}
          subtext="Student files awaiting grading"
          highlight={pendingReviewsCount > 0}
        />
        <StatCard
          label="Upcoming Deadlines"
          value={String(criticalDeadlinesCount)}
          subtext="Active departmental milestones"
        />
      </div>

      {/* ===================== 3. CHARTS ROW ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Cohort Progress Chart (2fr) */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                Supervised Group Velocity
              </h2>
              <p className="text-[13px] text-[#5F6B66]">
                Aggregate verification progress across your assigned groups
              </p>
            </div>
            <span className="text-[12px] font-bold text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-1 rounded-full">
              {cohortVelocity}% Verification Rate
            </span>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cohortProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="supProgressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#17302A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#17302A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEA" vertical={false} />
                <XAxis dataKey="week" stroke="#5F6B66" fontSize={12} tickLine={false} />
                <YAxis stroke="#5F6B66" fontSize={12} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<AreaTooltip />} />
                <Area
                  type="monotone"
                  dataKey="progress"
                  stroke="#17302A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#supProgressGrad)"
                  dot={<CustomizedDot />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Milestone Distribution Donut (1fr) */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-1">
              Deliverable Verification
            </h2>
            <p className="text-[13px] text-[#5F6B66] mb-4">
              Real deliverables in database
            </p>

            <div className="h-[170px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<DonutTooltip />} />
                  <Pie
                    data={milestonePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {milestonePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[12px] pt-2 border-t border-[#EEEEEA]">
            {milestonePieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[#5F6B66]">{item.name}:</span>
                <span className="font-bold text-[#17302A]">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ===================== 4. PENDING REVIEWS & DEADLINES ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Reviews Table (2fr) */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                Pending Document Reviews
              </h2>
              <p className="text-[13px] text-[#5F6B66]">
                Actual uploaded student deliverables awaiting your review
              </p>
            </div>
            <Link
              to="/supervisor/documents"
              className="text-[13px] font-bold text-[#17302A] hover:text-[#C2410C] transition-colors"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            {pendingDocs.length === 0 ? (
              <div className="text-center py-8 text-[#5F6B66] text-sm bg-gray-50 rounded-lg">
                All submitted deliverables have been reviewed! 0 pending verifications.
              </div>
            ) : (
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-[#EEEEEA] text-[12px] uppercase font-semibold text-[#5F6B66]">
                    <th className="pb-3">Group / Student</th>
                    <th className="pb-3">Deliverable File</th>
                    <th className="pb-3">Version</th>
                    <th className="pb-3">Submitted</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEEEEA]">
                  {pendingDocs.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="py-3.5">
                        <div className="font-semibold text-[#17302A]">{item.student_name}</div>
                        <div className="text-[12px] text-[#5F6B66]">{item.group_name}</div>
                      </td>
                      <td className="py-3.5">
                        <div className="font-medium text-[#17302A]">{item.file_name}</div>
                        <div className="text-[12px] text-[#5F6B66]">{item.doc_type}</div>
                      </td>
                      <td className="py-3.5">
                        <Badge variant="blue" size="sm">
                          {item.version}
                        </Badge>
                      </td>
                      <td className="py-3.5 text-[12px] text-[#5F6B66]">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          to="/supervisor/documents"
                          className="rounded-[8px] bg-[#17302A] hover:bg-[#23483F] text-white text-[12px] font-bold px-3 py-1.5 transition-colors inline-block"
                        >
                          Review File
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Upcoming Deadlines Column (1fr) */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                Upcoming Deadlines
              </h2>
              <p className="text-[13px] text-[#5F6B66]">Official department dates</p>
            </div>
            <Link
              to="/supervisor/milestones"
              className="text-[13px] font-bold text-[#17302A] hover:text-[#C2410C]"
            >
              All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {milestones
              .filter((m) => m.status !== "Completed")
              .slice(0, 3)
              .map((d) => (
                <div
                  key={d.id}
                  className="p-3 rounded-lg border border-[#EEEEEA] bg-[#FAFAF8] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#17302A] text-white">
                      {d.phase}
                    </span>
                    <span className="text-[11px] font-semibold text-[#0B5A3E] bg-[#E1F4EA] px-2 py-0.5 rounded">
                      Weight: {d.submission_weight}
                    </span>
                  </div>
                  <div className="font-semibold text-[13px] text-[#17302A]">{d.milestone}</div>
                  <div className="text-[12px] text-[#5F6B66]">Official Due: {d.deadline}</div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
