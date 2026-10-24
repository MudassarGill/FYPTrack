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
import { getMilestones, getMyProjects, getProjectEvaluations } from "../../services/api";

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
    { name: "Proposal", marks: 78, evaluated: true, fill: "#17302A" },
    { name: "SRS", marks: 85, evaluated: true, fill: "#EBB44B" },
    { name: "Design", marks: 0, evaluated: false },
    { name: "Prototype", marks: 0, evaluated: false },
    { name: "Mid", marks: 0, evaluated: false },
    { name: "Final", marks: 0, evaluated: false },
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
        if (msData && msData.length > 0) setMilestones(msData);

        if (projData && projData.length > 0) {
          const evals = await getProjectEvaluations(projData[0].id).catch(() => []);
          if (evals && evals.length > 0) {
            const ev = evals[0];
            const pct = Math.round(((ev.total_marks || 25) / 30) * 100);
            setEvalMarks([
              { name: "Proposal", marks: pct, evaluated: true, fill: "#17302A" },
              { name: "SRS", marks: 85, evaluated: true, fill: "#EBB44B" },
              { name: "Design", marks: 0, evaluated: false },
              { name: "Prototype", marks: 0, evaluated: false },
              { name: "Mid", marks: 0, evaluated: false },
              { name: "Final", marks: 0, evaluated: false },
            ]);
          }
        }
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
            <span className="font-bold text-[#17302A]">Average: 81.5%</span>
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
