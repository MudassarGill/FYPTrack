import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../components/shared/Toast";
import { getMyProjects, getMilestones, getNotifications } from "../../services/api";
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

import proposalImg from "../../assets/proposal.jpg";
import milestonesImg from "../../assets/milestones.jpg";
import similarityImg from "../../assets/similarity.jpg";
import feedbackImg from "../../assets/feedback.jpg";

// Sample data as constants at top of page file
const weeklyData = [
  { week: "W1", progress: 5 },
  { week: "W2", progress: 12 },
  { week: "W3", progress: 18 },
  { week: "W4", progress: 25 },
  { week: "W5", progress: 31 },
  { week: "W6", progress: 37 },
  { week: "W7", progress: 43 },
];

const milestonePieData = [
  { name: "Completed", value: 3, color: "#17302A" },
  { name: "In progress", value: 1, color: "#EBB44B" },
  { name: "Upcoming", value: 3, color: "#E6E9E6" },
];

const projectMilestones = [
  { name: "Proposal Defense", status: "Completed", variant: "green" },
  { name: "SRS Submission", status: "Completed", variant: "green" },
  { name: "Design Document", status: "In progress", variant: "blue" },
  { name: "Prototype Demo", status: "Upcoming", variant: "gray" },
];

const deadlines = [
  { title: "Design Document Submission", date: "12 Nov 2026", remaining: "In 4 days" },
  { title: "Prototype Demonstration", date: "05 Dec 2026", remaining: "In 3 weeks" },
  { title: "Mid-Term Evaluation", date: "20 Dec 2026", remaining: "In 5 weeks" },
];

const notifications = [
  { title: "Supervisor reviewed your SRS", badge: "New", badgeType: "blue" },
  { title: "Deadline reminder: Design Document", badge: "2d", badgeType: "gray" },
  { title: "Proposal approved", badge: "1w", badgeType: "gray" },
];

const groupMembersList = [
  { name: "Ayesha Noor", roll: "FA20-BSE-042", isYou: true },
  { name: "Hamza Tariq", roll: "FA20-BSE-058", isYou: false },
  { name: "Zainab Ali", roll: "FA20-BSE-019", isYou: false },
];

function AreaTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E6E6E1] rounded-[10px] p-2.5 shadow-md text-[13px] text-[#17302A]">
        <div className="font-semibold">{label}</div>
        <div className="text-[#5F6B66]">{payload[0].value}% complete</div>
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
        <div className="text-[#5F6B66]">{payload[0].value} milestone{payload[0].value > 1 ? "s" : ""}</div>
      </div>
    );
  }
  return null;
}

// Customized Dot for AreaChart
function CustomizedDot(props) {
  const { cx, cy, index } = props;
  const isLast = index === weeklyData.length - 1;
  if (isLast) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={7}
        fill="#EBB44B"
        stroke="#17302A"
        strokeWidth={2}
      />
    );
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={3.5}
      fill="#17302A"
    />
  );
}

function getDaysRemaining(dateStr) {
  if (!dateStr) return "Scheduled";
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return "Upcoming";
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);
  const diffTime = parsed - now;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Completed / Passed";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
  return `In ${Math.ceil(diffDays / 30)} months`;
}

export default function Dashboard() {
  const user = getStoredUser();
  const student = user?.student || {};

  const rollNo = student.roll_number || user?.roll_number || "FA20-BSE-042";
  const groupName = student.group_name || "Group 14";
  const program = student.program || "BS Software Engineering";
  const fullName = user?.full_name || "Ayesha Noor";
  const email = user?.email || "ayesha.noor@university.edu";

  const [coordForm, setCoordForm] = useState({
    subject: "milestone",
    message: "",
  });
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [liveNotifications, setLiveNotifications] = useState([]);

  useEffect(() => {
    getMyProjects()
      .then((data) => {
        if (data && data.length > 0) {
          setProject(data[0]);
        }
      })
      .catch((err) => console.error(err));

    getMilestones()
      .then((data) => {
        if (data && data.length > 0) {
          setMilestones(data);
        }
      })
      .catch((err) => console.error(err));

    getNotifications()
      .then((data) => {
        if (data && data.length > 0) {
          setLiveNotifications(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const totalMilestones = milestones.length > 0 ? milestones.length : 6;
  const completedMilestones = milestones.filter((m) => m.status === "Completed").length;
  const inProgressMilestones = milestones.filter(
    (m) => m.status === "Active" || m.status === "In progress"
  ).length;
  const upcomingMilestones = Math.max(0, totalMilestones - completedMilestones - inProgressMilestones);

  const currentPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const nextMilestone =
    milestones.find((m) => m.status === "Active" || m.status === "Upcoming") ||
    milestones[milestones.length - 1] || {
      milestone: "SRS Document",
      deadline: "12 Nov 2026",
    };

  const dynamicPieData = [
    { name: "Completed", value: completedMilestones, color: "#17302A" },
    { name: "In progress", value: inProgressMilestones, color: "#EBB44B" },
    { name: "Upcoming", value: upcomingMilestones, color: "#E6E9E6" },
  ];

  const dynamicWeeklyData = [
    { week: "W1", progress: 0 },
    { week: "W2", progress: Math.min(10, currentPercent) },
    { week: "W3", progress: Math.min(20, currentPercent) },
    { week: "W4", progress: Math.min(30, currentPercent) },
    { week: "W5", progress: Math.min(currentPercent, 40) },
    { week: "W6", progress: Math.min(currentPercent, 60) },
    { week: "Current", progress: currentPercent },
  ];

  const upcomingDeadlinesList = (milestones.length > 0 ? milestones : projectMilestones)
    .filter((m) => m.status !== "Completed")
    .slice(0, 3);

  const { addToast } = useToast();

  const handleCoordSubmit = (e) => {
    e.preventDefault();
    addToast("Message dispatched to FYP Coordinator successfully.");
    setCoordForm({ subject: "milestone", message: "" });
  };


  return (
    <div className="space-y-8 pb-12">
      {/* ===================== 1. PROJECT HERO BOX ===================== */}
      <div
        className="rounded-[20px] text-white shadow-[0_18px_40px_rgba(23,48,42,.35)] relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #17302A, #24493F)",
          padding: "44px 40px 92px",
        }}
      >
        <span
          className="inline-block px-3 py-1 text-[12px] font-semibold rounded-full mb-4"
          style={{ backgroundColor: "rgba(235,180,75,0.20)", color: "#F6D88E" }}
        >
          Your Final Year Project
        </span>
        <h1 className="font-['Bricolage_Grotesque'] font-bold text-[36px] sm:text-[44px] lg:text-[48px] leading-[1.08] tracking-tight text-white mb-3">
          {project?.title || "Final Year Project"}
        </h1>
        <p className="text-[16px] text-[#D5E3DD] max-w-2xl leading-relaxed mb-6">
          {project?.abstract || "Submit your proposal to start your FYP milestone tracking and supervisor reviews."}
        </p>

        {/* Three pills (white at 14%) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-white/14 text-white">
            Roll No: {rollNo}
          </span>
          <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-white/14 text-white">
            {project?.group_name || groupName}
          </span>
          <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-white/14 text-white">
            {project?.domain || program}
          </span>
        </div>
      </div>

      {/* ===================== 2. FOUR STAT CARDS (OVERLAPPING HERO) ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-4" style={{ marginTop: "-56px" }}>
        {/* Card 1: Proposal */}
        <div className="card-base card-hover flex flex-col justify-between">
          <div className="text-[13px] text-[#5F6B66] font-semibold">Proposal Status</div>
          <div className="font-['Bricolage_Grotesque'] text-[24px] font-bold text-[#17302A] my-1 truncate">
            {project?.status || "Draft"}
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#E1F4EA] text-[#0B5A3E]">
              {project?.coordinator_status || "Institutional Track"}
            </span>
          </div>
        </div>

        {/* Card 2: Supervisor */}
        <div className="card-base card-hover flex flex-col justify-between">
          <div className="text-[13px] text-[#5F6B66] font-semibold">Supervisor</div>
          <div className="font-['Bricolage_Grotesque'] text-[24px] font-bold text-[#17302A] my-1 truncate">
            {project?.supervisor_name || "Pending Allocation"}
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#E3EEF9] text-[#1E3A8A]">
              {project?.supervisor_name ? "Allocated" : "Awaiting"}
            </span>
          </div>
        </div>

        {/* Card 3: Milestones */}
        <div className="card-base card-hover flex flex-col justify-between">
          <div className="text-[13px] text-[#5F6B66] font-semibold">Milestones</div>
          <div className="font-['Bricolage_Grotesque'] text-[24px] font-bold text-[#17302A] my-1">
            {completedMilestones} of {totalMilestones} done
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#FEF3D6] text-[#6B4700]">
              {completedMilestones === totalMilestones
                ? "Completed"
                : completedMilestones > 0
                ? "On track"
                : "Not started"}
            </span>
          </div>
        </div>

        {/* Card 4: Next Deadline */}
        <div className="card-base card-hover flex flex-col justify-between">
          <div className="text-[13px] text-[#5F6B66] font-semibold">Next Deadline</div>
          <div className="font-['Bricolage_Grotesque'] text-[22px] font-bold text-[#17302A] my-1 truncate">
            {nextMilestone?.deadline || "TBA"}
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#ECECE8] text-[#4A5651] truncate max-w-full">
              {nextMilestone?.milestone || "Upcoming Phase"}
            </span>
          </div>
        </div>
      </div>

      {/* ===================== 3. CHARTS ROW (2fr / 1fr) ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card: Weekly Progress (2fr) */}
        <div className="lg:col-span-2 card-base flex flex-col justify-between" role="img" aria-label="Weekly Project Progress Chart">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                Weekly Progress
              </h3>
              <span className="text-[13px] text-[#5F6B66]">Session 2026</span>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicWeeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="#EEEEEA" vertical={false} />
                  <XAxis
                    dataKey="week"
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
                  <Tooltip content={<AreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="progress"
                    stroke="#17302A"
                    strokeWidth={2.5}
                    fill="rgba(235,180,75,0.35)"
                    dot={<CustomizedDot />}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="text-[13px] text-[#5F6B66] mt-4 pt-3 border-t border-[#EEEEEA]">
            Overall verified milestone progress is at {currentPercent}%.
          </p>
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
                    data={dynamicPieData}
                    innerRadius={54}
                    outerRadius={72}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {dynamicPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Centered text: dynamic completed of total */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-['Bricolage_Grotesque'] text-[24px] font-bold text-[#17302A] leading-tight">
                  {completedMilestones} of {totalMilestones}
                </span>
                <span className="text-[11px] text-[#5F6B66] uppercase tracking-wider">
                  completed
                </span>
              </div>
            </div>
          </div>

          {/* CSS-dot legend below */}
          <div className="flex items-center justify-center gap-4 pt-3 border-t border-[#EEEEEA] text-[12px] text-[#5F6B66]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#17302A]" />
              <span>Done ({completedMilestones})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EBB44B]" />
              <span>In progress ({inProgressMilestones})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E6E9E6]" />
              <span>Upcoming ({upcomingMilestones})</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== 4. TWO COLUMNS (2fr / 1fr) ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2fr): Project Progress & Upcoming Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Project Progress */}
          <div className="card-base">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                Project Progress
              </h3>
              <span className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                {currentPercent}%
              </span>
            </div>

            {/* 8px progress bar, track #E6E9E6, fill #17302A */}
            <div className="w-full h-2 bg-[#E6E9E6] rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-[#17302A] rounded-full transition-all duration-500"
                style={{ width: `${currentPercent}%` }}
              />
            </div>

            {/* Rows with badges */}
            <div className="space-y-3">
              {(milestones.length > 0 ? milestones : projectMilestones).map((m) => {
                let badgeClass = "bg-[#ECECE8] text-[#4A5651]";
                if (m.status === "Completed") badgeClass = "bg-[#E1F4EA] text-[#0B5A3E]";
                if (m.status === "Active" || m.status === "In progress") badgeClass = "bg-[#FEF3D6] text-[#6B4700]";
                return (
                  <div
                    key={m.id || m.name || m.milestone}
                    className="flex items-center justify-between py-2 border-b border-[#EEEEEA] last:border-0"
                  >
                    <span className="text-[14px] font-medium text-[#17302A]">{m.milestone || m.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${badgeClass}`}>
                      {m.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Upcoming Deadlines */}
          <div className="card-base">
            <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-4">
              Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {upcomingDeadlinesList.length === 0 ? (
                <div className="text-[13px] text-[#0B5A3E] font-medium p-3 bg-[#E1F4EA] rounded-lg">
                  All scheduled departmental milestones are marked as completed!
                </div>
              ) : (
                upcomingDeadlinesList.map((d) => (
                  <div
                    key={d.id || d.milestone || d.title}
                    className="flex items-center justify-between py-2.5 border-b border-[#EEEEEA] last:border-0"
                  >
                    <div>
                      <div className="text-[14px] font-semibold text-[#17302A]">{d.milestone || d.title}</div>
                      <div className="text-[12px] text-[#5F6B66]">{d.deadline || d.date}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#FEF3D6] text-[#6B4700]">
                      {getDaysRemaining(d.deadline || d.date)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1fr): Recent Notifications & Latest Feedback */}
        <div className="space-y-6">
          {/* Card: Recent Notifications */}
          <div className="card-base flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                  Recent Notifications
                </h3>
              </div>
              <div className="space-y-3">
                {(liveNotifications.length > 0 ? liveNotifications.slice(0, 3) : notifications).map((n, idx) => (
                  <div
                    key={n.id || idx}
                    className="flex items-center justify-between gap-2 py-2 border-b border-[#EEEEEA] last:border-0"
                  >
                    <span className="text-[13px] text-[#17302A] leading-snug">{n.title}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 bg-[#E3EEF9] text-[#1E3A8A]"
                    >
                      {n.badge || "New"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#EEEEEA]">
              <Link
                to="/student/notifications"
                className="inline-block w-full text-center rounded-[10px] border-[1.5px] border-[#17302A] text-[#17302A] font-bold text-[14px] px-[18px] py-[9px] hover:bg-[#17302A] hover:text-white transition-colors"
              >
                View all
              </Link>
            </div>
          </div>


          {/* Card: Latest Feedback */}
          <div className="card-base flex flex-col justify-between">
            <div>
              <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-3">
                Latest Feedback
              </h3>
              <div className="bg-[#F8F9F8] border border-[#E6E6E1] rounded-[12px] p-3.5 mb-3">
                <div className="text-[12px] font-bold text-[#17302A]">Dr. Imran Shah</div>
                <div className="text-[11px] text-[#5F6B66] mb-2">SRS Document Review</div>
                <p className="text-[13px] text-[#5F6B66] leading-relaxed line-clamp-3">
                  "Good functional requirements coverage for price forecasting. Ensure the dataset provenance and data validation pipelines are clearly documented in section 3.2."
                </p>
              </div>
            </div>
            <div>
              <Link
                to="/student/feedback"
                className="inline-block w-full text-center rounded-[10px] border-[1.5px] border-[#17302A] text-[#17302A] font-bold text-[14px] px-[18px] py-[9px] hover:bg-[#17302A] hover:text-white transition-colors"
              >
                Open feedback
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== 5. QUICK ACCESS ===================== */}
      <div>
        <h2 className="font-['Bricolage_Grotesque'] text-[24px] font-bold text-[#17302A] mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Box 1: My Proposal */}
          <Link to="/student/proposal" className="img-box group block">
            <div className="h-[170px] overflow-hidden">
              <img src={proposalImg} alt="My Proposal" className="w-full h-full object-cover" />
            </div>
            <div className="px-[22px] pt-[20px] pb-[24px]">
              <h3 className="img-box-title font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A] mb-1 transition-colors duration-300">
                My Proposal
              </h3>
              <p className="text-[14px] text-[#5F6B66]">View status, domain fit and similarity report.</p>
            </div>
          </Link>

          {/* Box 2: Milestones */}
          <Link to="/student/milestones" className="img-box group block">
            <div className="h-[170px] overflow-hidden">
              <img src={milestonesImg} alt="Milestones" className="w-full h-full object-cover" />
            </div>
            <div className="px-[22px] pt-[20px] pb-[24px]">
              <h3 className="img-box-title font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A] mb-1 transition-colors duration-300">
                Milestones
              </h3>
              <p className="text-[14px] text-[#5F6B66]">Track progress bars, marks and due dates.</p>
            </div>
          </Link>

          {/* Box 3: Documents */}
          <Link to="/student/documents" className="img-box group block">
            <div className="h-[170px] overflow-hidden">
              <img src={similarityImg} alt="Documents" className="w-full h-full object-cover" />
            </div>
            <div className="px-[22px] pt-[20px] pb-[24px]">
              <h3 className="img-box-title font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A] mb-1 transition-colors duration-300">
                Documents
              </h3>
              <p className="text-[14px] text-[#5F6B66]">Upload deliverables and check similarity.</p>
            </div>
          </Link>

          {/* Box 4: Feedback */}
          <Link to="/student/feedback" className="img-box group block">
            <div className="h-[170px] overflow-hidden">
              <img src={feedbackImg} alt="Feedback" className="w-full h-full object-cover" />
            </div>
            <div className="px-[22px] pt-[20px] pb-[24px]">
              <h3 className="img-box-title font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A] mb-1 transition-colors duration-300">
                Feedback
              </h3>
              <p className="text-[14px] text-[#5F6B66]">Read supervisor reviews and guidance.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ===================== 6. THREE CARDS IN A ROW ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Your Supervisor */}
        <div className="card-base flex flex-col justify-between">
          <div>
            <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-4">
              Your Supervisor
            </h3>
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-[48px] h-[48px] rounded-full bg-[#EBB44B] text-[#17302A] font-['Bricolage_Grotesque'] font-bold text-[18px] flex items-center justify-center shrink-0">
                {project?.supervisor_name
                  ? project.supervisor_name.split(" ").map((n) => n[0]).slice(0, 2).join("")
                  : "NA"}
              </div>
              <div>
                <div className="font-['Bricolage_Grotesque'] font-bold text-[16px] text-[#17302A]">
                  {project?.supervisor_name || "Pending Coordinator Allocation"}
                </div>
                <div className="text-[12px] text-[#5F6B66]">
                  {project?.supervisor_name ? "Assigned Mentor" : "Coordinator Reviewing"}
                </div>
              </div>
            </div>
            <p className="text-[13px] text-[#5F6B66] leading-relaxed">
              {project?.supervisor_name
                ? "Available for milestone consultations, document sign-offs, and continuous evaluation."
                : "A supervisor will be paired once your proposal is reviewed by the coordinator."}
            </p>
          </div>
          <div className="pt-3 border-t border-[#EEEEEA] mt-4">
            <span className="text-[12px] font-semibold text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-1 rounded-full">
              Available for consultation
            </span>
          </div>
        </div>

        {/* Card 2: Group Members */}
        <div className="card-base flex flex-col justify-between">
          <div>
            <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-4">
              Group Members
            </h3>
            <div className="space-y-3">
              {groupMembersList.map((m) => (
                <div key={m.roll} className="flex items-center justify-between py-1.5 border-b border-[#EEEEEA] last:border-0">
                  <div>
                    <div className="text-[14px] font-semibold text-[#17302A]">{m.name}</div>
                    <div className="text-[12px] text-[#5F6B66]">{m.roll}</div>
                  </div>
                  {m.isYou && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECECE8] text-[#4A5651]">
                      You
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-[#EEEEEA] text-[12px] text-[#5F6B66]">
            Group 14 &bull; 3 members
          </div>
        </div>

        {/* Card 3: Quick Actions */}
        <div className="card-base flex flex-col justify-between">
          <div>
            <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => addToast("Progress report draft prepared. You can upload files in the Milestones section.", "info")}
                className="w-full rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors cursor-pointer text-center"
              >
                Submit Progress Report
              </button>
              <Link
                to="/student/milestones"
                className="block w-full rounded-[10px] border-[1.5px] border-[#17302A] hover:bg-[#17302A] hover:text-white text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors text-center"
              >
                View Milestones
              </Link>
              <Link
                to="/student/documents"
                className="block w-full rounded-[10px] border-[1.5px] border-[#17302A] hover:bg-[#17302A] hover:text-white text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors text-center"
              >
                Upload Document
              </Link>
            </div>
          </div>
          <div className="pt-3 border-t border-[#EEEEEA] text-[12px] text-[#5F6B66]">
            Evaluation timeline updated
          </div>
        </div>
      </div>

      {/* ===================== 7. CONTACT YOUR COORDINATOR FORM CARD ===================== */}
      <div className="card-static">
        <h3 className="font-['Bricolage_Grotesque'] text-[22px] font-bold text-[#17302A] mb-1">
          Contact Your Coordinator
        </h3>
        <p className="text-[14px] text-[#5F6B66] mb-6">
          Have questions regarding project policies, supervisor assignments, or deadline extensions? Send a direct message.
        </p>

        <form onSubmit={handleCoordSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Full name
              </label>
              <input
                type="text"
                readOnly
                value={fullName}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-[#F8F9F8] px-3 py-[11px] text-[14px] text-[#5F6B66] outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Email
              </label>
              <input
                type="email"
                readOnly
                value={email}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-[#F8F9F8] px-3 py-[11px] text-[14px] text-[#5F6B66] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Subject
              </label>
              <select
                value={coordForm.subject}
                onChange={(e) => setCoordForm({ ...coordForm, subject: e.target.value })}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
              >
                <option value="milestone">Milestone submission inquiry</option>
                <option value="extension">Deadline extension request</option>
                <option value="supervisor">Supervisor allocation</option>
                <option value="policy">FYP policy clarification</option>
                <option value="other">Other question</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Roll number
              </label>
              <input
                type="text"
                readOnly
                value={rollNo}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-[#F8F9F8] px-3 py-[11px] text-[14px] text-[#5F6B66] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
              Message
            </label>
            <textarea
              rows={5}
              required
              placeholder="Describe your inquiry with relevant project details..."
              value={coordForm.message}
              onChange={(e) => setCoordForm({ ...coordForm, message: e.target.value })}
              className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6] resize-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[22px] py-[12px] transition-colors cursor-pointer shadow-sm"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
