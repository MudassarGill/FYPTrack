import { useState } from "react";
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

const milestonesList = [
  { name: "Proposal Defense", due: "15 Oct 2026", status: "Completed", variant: "green", eval: "78 / 100" },
  { name: "SRS Document Submission", due: "28 Oct 2026", status: "Completed", variant: "green", eval: "85 / 100" },
  { name: "System Design Document", due: "12 Nov 2026", status: "In progress", variant: "amber", eval: "Not evaluated" },
  { name: "Prototype Demonstration", due: "05 Dec 2026", status: "Upcoming", variant: "gray", eval: "Not evaluated" },
  { name: "Mid-Term Evaluation", due: "20 Dec 2026", status: "Upcoming", variant: "gray", eval: "Not evaluated" },
  { name: "Final Defense & Report", due: "15 Feb 2027", status: "Upcoming", variant: "gray", eval: "Not evaluated" },
  { name: "Comprehensive Viva", due: "28 Feb 2027", status: "Upcoming", variant: "gray", eval: "Not evaluated" },
];

const evalMarksData = [
  { name: "Proposal", marks: 78, evaluated: true, fill: "#17302A" },
  { name: "SRS", marks: 85, evaluated: true, fill: "#EBB44B" },
  { name: "Design", marks: 0, evaluated: false },
  { name: "Prototype", marks: 0, evaluated: false },
  { name: "Mid", marks: 0, evaluated: false },
  { name: "Final", marks: 0, evaluated: false },
];

const milestonePieData = [
  { name: "Completed", value: 3, color: "#17302A" },
  { name: "In progress", value: 1, color: "#EBB44B" },
  { name: "Upcoming", value: 3, color: "#E6E9E6" },
];

function CustomBar(props) {
  const { x, y, width, height, payload } = props;
  if (!payload.evaluated) {
    // 1px dashed #BFC8C2, radius 8px, drawn as empty outline
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
  return (
    <div className="space-y-8 pb-12">
      {/* Header = H1 30px Bricolage + muted subtitle */}
      <div>
        <h1 className="font-['Bricolage_Grotesque'] text-[30px] font-bold text-[#17302A] leading-tight">
          Project Milestones
        </h1>
        <p className="text-[14px] text-[#5F6B66] mt-1">
          Track official deliverables, supervisor evaluation marks, and milestone due dates.
        </p>
      </div>

      {/* Progress card: "3 of 7 milestones completed", 43%, 8px bar */}
      <div className="card-base">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A]">
            3 of 7 milestones completed
          </div>
          <div className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
            43%
          </div>
        </div>
        {/* Progress bar: 8px, track #E6E9E6, fill #17302A */}
        <div className="w-full h-2 bg-[#E6E9E6] rounded-full overflow-hidden">
          <div className="h-full bg-[#17302A] rounded-full" style={{ width: "43%" }} />
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
                <BarChart data={evalMarksData} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
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
          <p className="text-[13px] text-[#5F6B66] mt-4 pt-3 border-t border-[#EEEEEA]">
            Marks out of 100. Dashed bars are milestones not evaluated yet.
          </p>
        </div>

        {/* Card: Milestone Status (1fr) Donut */}
        <div className="card-base flex flex-col justify-between" role="img" aria-label="Milestone Status Donut">
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
                  3 of 7
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
              <span>Done (3)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EBB44B]" />
              <span>In progress (1)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E6E9E6]" />
              <span>Upcoming (3)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card: All Milestones (rows: bold name + "Due [Date]", status badge, "Evaluation: 78 / 85 / Not evaluated") */}
      <div className="card-base">
        <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-4">
          All Milestones
        </h3>
        <div className="space-y-3">
          {milestonesList.map((m) => {
            let badgeClass = "bg-[#ECECE8] text-[#4A5651]";
            if (m.variant === "green") badgeClass = "bg-[#E1F4EA] text-[#0B5A3E]";
            if (m.variant === "amber") badgeClass = "bg-[#FEF3D6] text-[#6B4700]";
            return (
              <div
                key={m.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3.5 border-b border-[#EEEEEA] last:border-0"
              >
                <div>
                  <div className="font-semibold text-[15px] text-[#17302A]">{m.name}</div>
                  <div className="text-[12px] text-[#5F6B66]">Due {m.due}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${badgeClass}`}>
                    {m.status}
                  </span>
                  <span className="text-[13px] font-medium text-[#17302A] min-w-[110px] text-right">
                    Evaluation: <span className="font-bold">{m.eval}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
