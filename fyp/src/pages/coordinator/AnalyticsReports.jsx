import { useState } from "react";
import { useToast } from "../../components/shared/Toast";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PageHeader from "../../components/shared/PageHeader";
import StatCard from "../../components/shared/StatCard";
import Card from "../../components/shared/Card";

const gradeDistribution = [
  { grade: "A (85-100)", count: 18, color: "#0B5A3E" },
  { grade: "B+ (75-84)", count: 16, color: "#17302A" },
  { grade: "B (65-74)", count: 9, color: "#EBB44B" },
  { grade: "C (50-64)", count: 4, color: "#E6E9E6" },
  { grade: "F / Incomplete", count: 1, color: "#B91C1C" },
];

const domainBreakdown = [
  { domain: "AI / Machine Learning", groups: 18 },
  { domain: "Distributed & Cloud", groups: 11 },
  { domain: "Robotics & Embedded", groups: 8 },
  { domain: "Cybersecurity & Crypto", groups: 6 },
  { domain: "Mobile & Full-Stack", groups: 5 },
];

export default function AnalyticsReports() {
  const { addToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleExportCSV = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      addToast("FYPTrack_Department_Annual_Report_2026.csv generated successfully!");
    }, 600);
  };

  const handleExportPDF = () => {
    addToast("Department Accreditation Dossier (PDF) export prepared.", "info");
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Department Analytics & Accreditation Reports"
        description="Comprehensive institutional metrics, domain distributions, cohort evaluation averages, and accreditation report exports."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={downloading}
              className="rounded-[10px] bg-[#EEEEEA] hover:bg-[#E0E0DC] text-[#17302A] font-bold text-[13px] px-4 py-2 transition-colors cursor-pointer"
            >
              {downloading ? "Exporting..." : "Export CSV"}
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="rounded-[10px] bg-[#17302A] hover:bg-[#24493F] text-white font-bold text-[13px] px-4 py-2 transition-colors cursor-pointer"
            >
              Generate Accreditation PDF
            </button>
          </div>
        }
      />

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Department On-Time Rate" value="91.6%" subtext="+4.2% higher than 2025 cohort" highlight={true} />
        <StatCard label="Cohort Average Score" value="79.4" subtext="Standard deviation ± 6.2" />
        <StatCard label="Total Project Artifacts" value="384" subtext="Indexed in institutional repository" />
        <StatCard label="Accreditation Readlines" value="100%" subtext="All rubric scores digitally audited" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                Project Domain Distribution
              </h3>
              <p className="text-[13px] text-[#5F6B66]">48 groups categorized by specialization</p>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainBreakdown} layout="vertical" margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEA" horizontal={false} />
                <XAxis type="number" stroke="#5F6B66" fontSize={12} />
                <YAxis type="category" dataKey="domain" stroke="#5F6B66" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="groups" name="Groups" fill="#17302A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Evaluation Grade Distribution */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                  Mid-Term Evaluation Grade Spectrum
                </h3>
                <p className="text-[13px] text-[#5F6B66]">Based on official supervisor rubric entries</p>
              </div>
            </div>

            <div className="h-[200px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[12px] pt-3 border-t border-[#EEEEEA]">
            {gradeDistribution.map((item) => (
              <div key={item.grade} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[#5F6B66]">{item.grade}:</span>
                <span className="font-bold text-[#17302A]">{item.count} groups</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
