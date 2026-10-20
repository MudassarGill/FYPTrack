import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { getStoredUser } from "../../services/auth";

const stageCompletionData = [
  { stage: "Proposal", completed: 44, pending: 4 },
  { stage: "SRS", completed: 38, pending: 10 },
  { stage: "Design", completed: 26, pending: 22 },
  { stage: "Prototype", completed: 14, pending: 34 },
  { stage: "Defense", completed: 2, pending: 46 },
];

const facultyWorkloadData = [
  { name: "Dr. Imran Shah", assigned: 4, max: 5 },
  { name: "Dr. Noman Ali", assigned: 5, max: 5 },
  { name: "Dr. Rabia Qazi", assigned: 3, max: 5 },
  { name: "Dr. Asim Javed", assigned: 2, max: 4 },
  { name: "Dr. Sadia Malik", assigned: 4, max: 4 },
  { name: "Dr. Bilal Saeed", assigned: 1, max: 4 },
];

const pendingDecisions = [
  {
    id: 1,
    group: "Group 14",
    title: "Crop Price Prediction and Market Advisory System",
    leadStudent: "Ayesha Noor",
    endorsedBy: "Dr. Imran Shah",
    similarity: "94% Unique",
    status: "Supervisor Endorsed",
    variant: "blue",
  },
  {
    id: 2,
    group: "Group 33",
    title: "Federated Learning for Medical Imaging Privacy",
    leadStudent: "Usman Tariq",
    endorsedBy: "Dr. Imran Shah",
    similarity: "96% Unique",
    status: "Supervisor Endorsed",
    variant: "blue",
  },
  {
    id: 3,
    group: "Group 19",
    title: "Real-Time Edge Defect Inspection for Textile Looms",
    leadStudent: "Fahad Mustafa",
    endorsedBy: "Dr. Rabia Qazi",
    similarity: "89% Unique",
    status: "Revisions Submitted",
    variant: "amber",
  },
  {
    id: 4,
    group: "Group 42",
    title: "Blockchain Powered Degree Verification Protocol",
    leadStudent: "Zubair Ahmad",
    endorsedBy: "Dr. Sadia Malik",
    similarity: "76% Flagged",
    status: "High Similarity",
    variant: "gray",
  },
];

function CustomStageTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E6E6E1] rounded-[10px] p-2.5 shadow-md text-[13px] text-[#17302A]">
        <div className="font-semibold">{label} Stage</div>
        <div className="text-[#0B5A3E] font-medium">{payload[0].value} Groups Completed</div>
        <div className="text-[#6B4700] font-medium">{payload[1]?.value} In Progress / Pending</div>
      </div>
    );
  }
  return null;
}

export default function CoordinatorOverview() {
  const user = getStoredUser();
  const coordinatorName = user?.full_name || "Prof. Dr. Tariq Mahmood";

  return (
    <div className="space-y-8 pb-12">
      {/* ===================== 1. COORDINATOR HERO ===================== */}
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
                Department Administration • FYP Programme Committee
              </span>
              <span className="text-xs text-[#D5E3DD]/80">Academic Year 2026</span>
            </div>
            <h1 className="font-['Bricolage_Grotesque'] font-bold text-[32px] sm:text-[40px] leading-tight text-white mb-2">
              Welcome, {coordinatorName}
            </h1>
            <p className="text-[15px] text-[#D5E3DD] max-w-2xl leading-relaxed">
              Program-wide oversight for 48 active FYP groups. Ratify proposals, manage AI-assisted supervisor allocations, inspect similarity vectors, and track milestone health.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/coordinator/proposals"
              className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors shadow-sm"
            >
              Decision Queue (4)
            </Link>
            <Link
              to="/coordinator/supervisors"
              className="rounded-[10px] border border-white/35 hover:bg-white/10 text-white font-bold text-[14px] px-[18px] py-[11px] transition-colors"
            >
              AI Supervisor Allocations
            </Link>
          </div>
        </div>
      </div>

      {/* ===================== 2. PROGRAM METRICS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Registered Students"
          value="142"
          subtext="Distributed across 48 project groups"
        />
        <StatCard
          label="Supervising Faculty"
          value="18"
          subtext="78% department capacity utilized"
        />
        <StatCard
          label="Pending Proposal Decisions"
          value="4"
          subtext="Awaiting coordinator final sign-off"
          highlight={true}
        />
        <StatCard
          label="AI Similarity Flags"
          value="1"
          subtext="Group 42 flagged (>24% overlap)"
        />
      </div>

      {/* ===================== 3. CHARTS ROW ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Funnel Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                Department Project Pipeline
              </h2>
              <p className="text-[13px] text-[#5F6B66]">
                Progression across all 48 capstone groups by phase
              </p>
            </div>
            <span className="text-[12px] font-bold text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-1 rounded-full">
              Spring 2026
            </span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageCompletionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEA" vertical={false} />
                <XAxis dataKey="stage" stroke="#5F6B66" fontSize={12} tickLine={false} />
                <YAxis stroke="#5F6B66" fontSize={12} tickLine={false} />
                <Tooltip content={<CustomStageTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="completed" name="Completed Groups" fill="#17302A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="In Progress" fill="#EBB44B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Supervisor Workload Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                Faculty Workload & Quota
              </h2>
              <p className="text-[13px] text-[#5F6B66]">
                Allocated groups vs maximum supervision capacity
              </p>
            </div>
            <Link
              to="/coordinator/supervisors"
              className="text-[13px] font-bold text-[#17302A] hover:text-[#C2410C]"
            >
              Balance &rarr;
            </Link>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={facultyWorkloadData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEA" horizontal={false} />
                <XAxis type="number" stroke="#5F6B66" fontSize={12} domain={[0, 6]} />
                <YAxis type="category" dataKey="name" stroke="#5F6B66" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="assigned" name="Assigned Groups" fill="#0B5A3E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ===================== 4. PENDING DECISIONS & AI SIMILARITY SUMMARY ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Ratification Table (2fr) */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                Pending Final Proposal Ratifications
              </h2>
              <p className="text-[13px] text-[#5F6B66]">
                Proposals with supervisor endorsements awaiting coordinator approval
              </p>
            </div>
            <Link
              to="/coordinator/proposals"
              className="text-[13px] font-bold text-[#17302A] hover:text-[#C2410C] transition-colors"
            >
              View all 48 &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#EEEEEA] text-[12px] uppercase font-semibold text-[#5F6B66]">
                  <th className="pb-3">Group</th>
                  <th className="pb-3">Project Title</th>
                  <th className="pb-3">Supervisor</th>
                  <th className="pb-3">AI Similarity</th>
                  <th className="pb-3 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEA]">
                {pendingDecisions.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F9F9F8] transition-colors">
                    <td className="py-3.5">
                      <span className="font-bold text-[#17302A]">{p.group}</span>
                      <div className="text-[12px] text-[#5F6B66]">{p.leadStudent}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-medium text-[#17302A] line-clamp-1 max-w-[220px]">
                        {p.title}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="text-[13px] font-medium text-[#17302A]">{p.endorsedBy}</div>
                      <div className="text-[11px] text-[#0B5A3E]">Endorsed</div>
                    </td>
                    <td className="py-3.5">
                      <Badge
                        variant={p.similarity.includes("Flagged") ? "gray" : "green"}
                        size="sm"
                      >
                        {p.similarity}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to="/coordinator/proposals"
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

        {/* Originality & Archive Screening (1fr) */}
        <div
          className="rounded-[16px] p-6 text-white flex flex-col justify-between shadow-[0_12px_28px_rgba(23,48,42,0.18)]"
          style={{ backgroundColor: "#17302A" }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EBB44B]/20 text-[#F6D88E] border border-[#EBB44B]/30">
                Originality Screening
              </span>
              <span className="text-[11px] text-[#A9B8B2]">Archive Cross-Check</span>
            </div>
            <h3 className="font-['Bricolage_Grotesque'] text-[19px] font-bold text-white mb-2">
              Department Originality Status
            </h3>
            <p className="text-[13px] text-[#D5E3DD] leading-relaxed mb-4">
              All student project proposals are cross-referenced across departmental capstone archives to ensure novelty and maintain academic integrity.
            </p>
            <div className="space-y-2.5 text-[12px] text-[#CFE0D9]">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span>Archived Projects Evaluated:</span>
                <span className="font-bold text-[#EBB44B]">450+ Theses</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span>Novelty Clear Submissions:</span>
                <span className="font-bold text-emerald-400">97.9% Novel</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span>Average Originality Score:</span>
                <span className="font-bold text-white">94% Uniqueness</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Flags Pending Review:</span>
                <span className="font-bold text-amber-300">0 High Risk</span>
              </div>
            </div>
          </div>

          <Link
            to="/coordinator/similarity"
            className="block text-center mt-6 rounded-[8px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[13px] py-2 transition-colors"
          >
            Open Originality Checker &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
