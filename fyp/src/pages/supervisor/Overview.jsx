import { useState } from "react";
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
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";

// Mock data isolated for frontend development
const cohortProgressData = [
  { week: "W1", progress: 8 },
  { week: "W2", progress: 16 },
  { week: "W3", progress: 28 },
  { week: "W4", progress: 41 },
  { week: "W5", progress: 54 },
  { week: "W6", progress: 67 },
  { week: "W7", progress: 78 },
];

const milestonePieData = [
  { name: "Completed", value: 14, color: "#17302A" },
  { name: "In Progress", value: 6, color: "#EBB44B" },
  { name: "Under Review", value: 3, color: "#2563EB" },
  { name: "Upcoming", value: 5, color: "#E6E9E6" },
];

const pendingReviews = [
  {
    id: 1,
    student: "Ayesha Noor",
    group: "Group 14",
    title: "Crop Price Prediction System",
    docType: "SRS Specification v2.1",
    submitted: "2 hours ago",
    similarity: "94% Unique",
    variant: "blue",
    link: "/supervisor/documents",
  },
  {
    id: 2,
    student: "Bilal Farooq",
    group: "Group 08",
    title: "Autonomous Campus Shuttle Navigation",
    docType: "System Architecture Design",
    submitted: "Yesterday",
    similarity: "98% Unique",
    variant: "amber",
    link: "/supervisor/documents",
  },
  {
    id: 3,
    student: "Hassan Raza",
    group: "Group 21",
    title: "Smart Grid Load Balancer",
    docType: "Prototype Code Repository",
    submitted: "2 days ago",
    similarity: "91% Unique",
    variant: "blue",
    link: "/supervisor/documents",
  },
];

const upcomingDeadlines = [
  {
    group: "Group 14",
    title: "Design Document Submission",
    date: "12 Nov 2026",
    daysLeft: "4 days left",
    priority: "high",
  },
  {
    group: "Group 08",
    title: "Prototype Demonstration",
    date: "18 Nov 2026",
    daysLeft: "10 days left",
    priority: "medium",
  },
  {
    group: "Group 21",
    title: "Mid-Term Defense Presentation",
    date: "02 Dec 2026",
    daysLeft: "24 days left",
    priority: "normal",
  },
];

const recentSubmissions = [
  {
    student: "Hamza Tariq",
    roll: "FA20-BSE-058",
    group: "Group 14",
    item: "High-level Architecture Diagram",
    timestamp: "Today, 10:45 AM",
  },
  {
    student: "Sara Ahmed",
    roll: "FA20-BCS-112",
    group: "Group 08",
    item: "Sensor Calibration Benchmark Log",
    timestamp: "Yesterday, 4:15 PM",
  },
  {
    student: "Zainab Ali",
    roll: "FA20-BSE-019",
    group: "Group 14",
    item: "Data Pipeline Ingestion Script",
    timestamp: "18 Oct 2026",
  },
];

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
        <div className="text-[#5F6B66]">{payload[0].value} Milestones</div>
      </div>
    );
  }
  return null;
}

function CustomizedDot(props) {
  const { cx, cy, index } = props;
  const isLast = index === cohortProgressData.length - 1;
  if (isLast) {
    return (
      <circle cx={cx} cy={cy} r={7} fill="#EBB44B" stroke="#17302A" strokeWidth={2} />
    );
  }
  return <circle cx={cx} cy={cy} r={3.5} fill="#17302A" />;
}

export default function SupervisorOverview() {
  const user = getStoredUser();
  const supervisorName = user?.full_name || "Dr. Imran Shah";

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
                Supervisor Portal • Computer Science
              </span>
              <span className="text-xs text-[#D5E3DD]/80">Capacity: 4 / 5 Groups Allocated</span>
            </div>
            <h1 className="font-['Bricolage_Grotesque'] font-bold text-[32px] sm:text-[40px] leading-tight text-white mb-2">
              Welcome back, {supervisorName}
            </h1>
            <p className="text-[15px] text-[#D5E3DD] max-w-2xl leading-relaxed">
              Track student milestone submissions, conduct document evaluations, and provide targeted feedback across all your assigned FYP groups.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/supervisor/documents"
              className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors shadow-sm"
            >
              Review Pending (3)
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
          value="11"
          subtext="Across 4 final year project groups"
        />
        <StatCard
          label="Active Projects"
          value="4"
          subtext="3 in development, 1 in final phase"
        />
        <StatCard
          label="Pending Reviews"
          value="3"
          subtext="Documents awaiting your evaluation"
          highlight={true}
        />
        <StatCard
          label="Upcoming Deadlines"
          value="2"
          subtext="Milestones due within next 14 days"
        />
      </div>

      {/* ===================== 3. CHARTS ROW ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Cohort Progress Chart (2fr) */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                Average Milestone Progress
              </h2>
              <p className="text-[13px] text-[#5F6B66]">
                Aggregate completion velocity across your supervised groups
              </p>
            </div>
            <span className="text-[12px] font-bold text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-1 rounded-full">
              78% Overall Velocity
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
              Milestone Status
            </h2>
            <p className="text-[13px] text-[#5F6B66] mb-4">
              28 total deliverables tracked
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
                Submissions awaiting your feedback and formal grading
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
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#EEEEEA] text-[12px] uppercase font-semibold text-[#5F6B66]">
                  <th className="pb-3">Group / Student</th>
                  <th className="pb-3">Document</th>
                  <th className="pb-3">AI Similarity</th>
                  <th className="pb-3">Submitted</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEA]">
                {pendingReviews.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F9F9F8] transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-[#17302A]">{item.group}</div>
                      <div className="text-[12px] text-[#5F6B66]">{item.student}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-medium text-[#17302A]">{item.docType}</div>
                      <div className="text-[12px] text-[#5F6B66] truncate max-w-[180px]">{item.title}</div>
                    </td>
                    <td className="py-3.5">
                      <Badge variant="green" size="sm">{item.similarity}</Badge>
                    </td>
                    <td className="py-3.5 text-[13px] text-[#5F6B66]">{item.submitted}</td>
                    <td className="py-3.5 text-right">
                      <Link
                        to="/supervisor/documents"
                        className="inline-block rounded-[8px] bg-[#17302A] hover:bg-[#24493F] text-white text-[12px] font-bold px-3 py-1.5 transition-colors cursor-pointer"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Upcoming Deadlines (1fr) */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                Upcoming Deadlines
              </h2>
              <span className="text-[12px] font-semibold text-[#5F6B66]">Next 30 days</span>
            </div>

            <div className="space-y-4">
              {upcomingDeadlines.map((dl) => (
                <div key={dl.title} className="p-3.5 rounded-xl border border-[#EEEEEA] bg-[#FAFAF8]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-[#17302A] px-2 py-0.5 rounded bg-white border border-[#E6E6E1]">
                      {dl.group}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        dl.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : dl.priority === "medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {dl.daysLeft}
                    </span>
                  </div>
                  <div className="font-bold text-[14px] text-[#17302A] mt-1.5">{dl.title}</div>
                  <div className="text-[12px] text-[#5F6B66] mt-0.5">Due: {dl.date}</div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/supervisor/milestones"
            className="block text-center mt-4 text-[13px] font-bold text-[#17302A] hover:text-[#C2410C] transition-colors"
          >
            Manage all milestones &rarr;
          </Link>
        </Card>
      </div>

      {/* ===================== 5. RECENT ACTIVITY & AI INSIGHTS ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions Feed (2fr) */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-1">
            Recent Student Submissions
          </h2>
          <p className="text-[13px] text-[#5F6B66] mb-4">
            Live stream of uploaded materials and commits across your assigned students
          </p>

          <div className="space-y-3">
            {recentSubmissions.map((sub, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-xl border border-[#EEEEEA] bg-white hover:border-[#D3D8D4] transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#E1F4EA] text-[#0B5A3E] font-bold text-[13px] flex items-center justify-center shrink-0">
                    {sub.student.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#17302A]">
                      {sub.student}{" "}
                      <span className="text-[12px] font-normal text-[#5F6B66]">({sub.roll} • {sub.group})</span>
                    </div>
                    <div className="text-[13px] text-[#5F6B66]">{sub.item}</div>
                  </div>
                </div>
                <span className="text-[12px] text-[#5F6B66] shrink-0 font-medium">{sub.timestamp}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Supervisor Intelligence Card (1fr) */}
        <div
          className="rounded-[16px] p-6 text-white flex flex-col justify-between shadow-[0_12px_28px_rgba(23,48,42,0.18)]"
          style={{ backgroundColor: "#17302A" }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EBB44B]/20 text-[#F6D88E] border border-[#EBB44B]/30">
                AI Embeddings Engine
              </span>
              <span className="text-[11px] text-[#A9B8B2]">Open-Source NLP</span>
            </div>
            <h3 className="font-['Bricolage_Grotesque'] text-[19px] font-bold text-white mb-2">
              Topic & Plagiarism Vector Fit
            </h3>
            <p className="text-[13px] text-[#D5E3DD] leading-relaxed mb-4">
              All student proposals & documents are processed via open-source embedding models (sentence-transformers / MiniLM).
            </p>
            <div className="space-y-2.5 text-[12px] text-[#CFE0D9]">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span>Avg Topic Alignment:</span>
                <span className="font-bold text-[#EBB44B]">92.4% Match</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span>Plagiarism Anomaly Check:</span>
                <span className="font-bold text-emerald-400">0 High Risk</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Suggested Next Action:</span>
                <span className="text-white">Sign off Group 14 SRS v2</span>
              </div>
            </div>
          </div>

          <Link
            to="/supervisor/proposals"
            className="block text-center mt-6 rounded-[8px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[13px] py-2 transition-colors"
          >
            Review Proposals with AI &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
