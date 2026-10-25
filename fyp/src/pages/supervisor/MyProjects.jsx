import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { getMyProjects } from "../../services/api";

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("All");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      const data = await getMyProjects();
      setProjects(data || []);
    } catch (err) {
      console.error("Failed to load supervisor projects:", err);
    } finally {
      setLoading(false);
    }
  }

  const mappedProjects = projects.map((p) => {
    const rawMembers = p.group_members
      ? p.group_members.split(",").map((m) => m.trim()).filter(Boolean)
      : [p.student_name];
    const members = rawMembers.map((m, idx) => {
      // Parse "Name (ROLL-NO)" format — extract name and roll separately
      const rollMatch = m.match(/\(([^)]+)\)/);
      let name = m.replace(/\(.*?\)/g, "").replace(/\(Lead\)/i, "").trim();
      let roll = "";
      if (rollMatch) {
        const candidate = rollMatch[1].trim();
        // Only treat as roll number if it contains digits (e.g. FA21-BSE-025)
        if (/\d/.test(candidate)) {
          roll = candidate;
        }
      }
      return { name, roll, lead: idx === 0 };
    });

    const rawTech = p.technologies
      ? p.technologies.split(",").map((t) => t.trim()).filter(Boolean)
      : ["Python", "React"];

    const isApproved = p.status?.includes("Approved");
    return {
      id: p.id,
      group: p.group_name,
      title: p.title,
      domain: p.domain,
      abstract: p.abstract,
      members,
      progress: isApproved ? 70 : 45,
      currentPhase: isApproved ? "System Design Document" : "Proposal Defense",
      status: p.status || "In Progress",
      variant: isApproved ? "green" : "amber",
      similarityScore: `${p.originality_score || 94}% Originality`,
      technologies: rawTech,
      milestones: [
        { name: "Proposal Defense", status: "completed" },
        { name: "SRS Document", status: isApproved ? "completed" : "in_progress" },
        { name: "System Design", status: isApproved ? "in_progress" : "upcoming" },
        { name: "Prototype Demo", status: "upcoming" },
        { name: "Final Defense", status: "upcoming" },
      ],
    };
  });

  const domains = ["All", ...Array.from(new Set(projects.map((p) => p.domain).filter(Boolean)))];

  const filteredProjects = mappedProjects.filter((p) => {
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
              {filteredProjects.length} Active Groups
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
      {filteredProjects.length === 0 ? (
        <div className="card-base text-center py-12 text-[#5F6B66]">
          <div className="text-[16px] font-semibold text-[#17302A]">No assigned projects currently</div>
          <p className="text-[13px] mt-1">
            Student projects allocated to you by the coordinator will be cataloged here for ongoing milestone mentorship.
          </p>
        </div>
      ) : (
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
                  {p.members.map((m, idx) => (
                    <div key={m.name + idx} className="flex items-center gap-2 text-[13px]">
                      <span className="w-6 h-6 rounded-full bg-[#E1F4EA] text-[#0B5A3E] text-[11px] font-bold flex items-center justify-center">
                        {m.name[0]}
                      </span>
                      <span className="font-medium text-[#17302A]">
                        {m.name} {m.lead && <span className="text-[10px] text-[#EBB44B] font-bold">(Lead)</span>}
                      </span>
                      {m.roll && <span className="text-[11px] text-[#5F6B66]">({m.roll})</span>}
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
      )}
    </div>
  );
}
