import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";

const projectsList = [
  {
    id: 1,
    group: "Group 14",
    title: "Crop Price Prediction and Market Advisory System",
    domain: "Machine Learning & Time-Series",
    abstract:
      "Forecasting mandi agricultural prices using deep learning and open-source embedding analysis over multi-season weather and arrival volume records.",
    members: [
      { name: "Ayesha Noor", roll: "FA20-BSE-042", lead: true },
      { name: "Hamza Tariq", roll: "FA20-BSE-058", lead: false },
      { name: "Zainab Ali", roll: "FA20-BSE-019", lead: false },
    ],
    progress: 70,
    currentPhase: "System Design Document",
    status: "In Progress",
    variant: "amber",
    similarityScore: "94% Originality",
    technologies: ["Python", "FastAPI", "TensorFlow", "React", "PostgreSQL"],
    milestones: [
      { name: "Proposal Defense", status: "completed" },
      { name: "SRS Document", status: "completed" },
      { name: "System Design", status: "in_progress" },
      { name: "Prototype Demo", status: "upcoming" },
      { name: "Final Defense", status: "upcoming" },
    ],
  },
  {
    id: 2,
    group: "Group 08",
    title: "Autonomous Campus Shuttle Navigation",
    domain: "Robotics & Embedded Systems",
    abstract:
      "LiDAR and computer vision pipeline for automated lane tracking and obstacle avoidance on university ring road pathways.",
    members: [
      { name: "Bilal Farooq", roll: "FA20-BCS-089", lead: true },
      { name: "Sara Ahmed", roll: "FA20-BCS-112", lead: false },
    ],
    progress: 45,
    currentPhase: "Prototype Sensor Integration",
    status: "Needs Attention",
    variant: "amber",
    similarityScore: "98% Originality",
    technologies: ["ROS 2", "Python", "OpenCV", "C++", "Jetson Nano"],
    milestones: [
      { name: "Proposal Defense", status: "completed" },
      { name: "SRS Document", status: "completed" },
      { name: "System Design", status: "in_progress" },
      { name: "Prototype Demo", status: "upcoming" },
      { name: "Final Defense", status: "upcoming" },
    ],
  },
  {
    id: 3,
    group: "Group 21",
    title: "Smart Grid Load Balancer & Anomaly Detection",
    domain: "IoT & Distributed Systems",
    abstract:
      "Edge-computing device architecture forecasting localized electricity peak surges and balancing micro-grid battery arrays.",
    members: [
      { name: "Hassan Raza", roll: "FA20-BSE-103", lead: true },
      { name: "Mariam Khan", roll: "FA20-BSE-077", lead: false },
    ],
    progress: 85,
    currentPhase: "Mid-Term Evaluation Prep",
    status: "On Track",
    variant: "green",
    similarityScore: "91% Originality",
    technologies: ["Node.js", "Python", "MQTT", "TimescaleDB", "React"],
    milestones: [
      { name: "Proposal Defense", status: "completed" },
      { name: "SRS Document", status: "completed" },
      { name: "System Design", status: "completed" },
      { name: "Prototype Demo", status: "in_progress" },
      { name: "Final Defense", status: "upcoming" },
    ],
  },
  {
    id: 4,
    group: "Group 33",
    title: "Federated Learning for Medical Imaging Privacy",
    domain: "Healthcare AI & Security",
    abstract:
      "Decentralized neural network training over chest X-Ray DICOM data without exposing raw patient records across multi-hospital servers.",
    members: [
      { name: "Usman Tariq", roll: "FA20-BCS-034", lead: true },
      { name: "Khadija Bibi", roll: "FA20-BCS-065", lead: false },
    ],
    progress: 30,
    currentPhase: "SRS Document Review",
    status: "Under Review",
    variant: "blue",
    similarityScore: "96% Originality",
    technologies: ["PyTorch", "Flower FL", "FastAPI", "Docker"],
    milestones: [
      { name: "Proposal Defense", status: "completed" },
      { name: "SRS Document", status: "in_progress" },
      { name: "System Design", status: "upcoming" },
      { name: "Prototype Demo", status: "upcoming" },
      { name: "Final Defense", status: "upcoming" },
    ],
  },
];

export default function MyProjects() {
  const [selectedDomain, setSelectedDomain] = useState("All");

  const domains = ["All", "Machine Learning & Time-Series", "Robotics & Embedded Systems", "IoT & Distributed Systems", "Healthcare AI & Security"];

  const filteredProjects = projectsList.filter((p) => {
    if (selectedDomain === "All") return true;
    return p.domain === selectedDomain;
  });

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="My Projects"
        description="Comprehensive portfolio of projects under your academic mentorship and supervision."
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
              4 Active Groups
            </span>
          </div>
        }
      />

      {/* Domain Filters */}
      <div className="flex flex-wrap gap-2">
        {domains.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDomain(d)}
            className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-semibold transition-colors cursor-pointer ${
              selectedDomain === d
                ? "bg-[#17302A] text-white"
                : "bg-white border border-[#E6E6E1] text-[#5F6B66] hover:bg-[#F4F4F2]"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((p) => (
          <Card key={p.id} className="p-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold px-2.5 py-0.5 rounded bg-[#17302A] text-white">
                    {p.group}
                  </span>
                  <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded bg-[#E1F4EA] text-[#0B5A3E]">
                    {p.domain}
                  </span>
                </div>
                <Badge variant={p.variant} size="sm">
                  {p.status}
                </Badge>
              </div>

              {/* Title & Abstract */}
              <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] leading-snug mb-2">
                {p.title}
              </h3>
              <p className="text-[14px] text-[#5F6B66] leading-relaxed mb-4">
                {p.abstract}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#EEEEEA] text-[#17302A]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Team Members */}
              <div className="border-t border-[#EEEEEA] pt-3.5 mb-4">
                <div className="text-[12px] font-semibold uppercase tracking-wider text-[#5F6B66] mb-2">
                  Student Team
                </div>
                <div className="flex flex-wrap gap-3">
                  {p.members.map((m) => (
                    <div key={m.roll} className="flex items-center gap-2 text-[13px]">
                      <span className="w-6 h-6 rounded-full bg-[#E1F4EA] text-[#0B5A3E] text-[11px] font-bold flex items-center justify-center">
                        {m.name[0]}
                      </span>
                      <span className="font-medium text-[#17302A]">
                        {m.name} {m.lead && <span className="text-[10px] text-[#EBB44B] font-bold">(Lead)</span>}
                      </span>
                      <span className="text-[11px] text-[#5F6B66]">({m.roll})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress & Milestones */}
              <div className="space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="font-semibold text-[#17302A]">Current: {p.currentPhase}</span>
                  <span className="font-bold text-[#17302A]">{p.progress}% Complete</span>
                </div>
                <div className="h-2.5 w-full bg-[#E6E9E6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#17302A] rounded-full transition-all duration-500"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestone pipeline pills */}
              <div className="flex items-center justify-between text-[11px] pt-3 text-[#5F6B66]">
                {p.milestones.map((m, idx) => (
                  <div key={m.name} className="flex flex-col items-center gap-1">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        m.status === "completed"
                          ? "bg-[#17302A]"
                          : m.status === "in_progress"
                          ? "bg-[#EBB44B]"
                          : "bg-[#E6E9E6]"
                      }`}
                    />
                    <span className="hidden sm:inline">{m.name.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#EEEEEA] flex flex-wrap items-center justify-between gap-3">
              <span className="text-[12px] font-semibold text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-1 rounded-full">
                AI Embeddings: {p.similarityScore}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  to="/supervisor/documents"
                  className="rounded-[8px] bg-[#EEEEEA] hover:bg-[#E0E0DC] text-[#17302A] text-[12px] font-bold px-3 py-1.5 transition-colors"
                >
                  Documents
                </Link>
                <Link
                  to="/supervisor/milestones"
                  className="rounded-[8px] bg-[#17302A] hover:bg-[#24493F] text-white text-[12px] font-bold px-3.5 py-1.5 transition-colors"
                >
                  Milestones
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
