import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";
import { getAllProjects } from "../../services/api";

export default function CoordinatorProjects() {
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDossier, setSelectedDossier] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data || []);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = projects.filter((p) => {
    const matchSearch =
      (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.group_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.supervisor_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.domain || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Department Projects Master Registry"
        description="Institutional roster of all student capstone projects, supervising faculty, current progress, and coordinator status."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            {projects.length} Registered Projects
          </span>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by title, group, supervisor, domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["All", "Submitted", "Approved", "Changes Requested"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-[8px] text-[12px] font-bold transition-colors cursor-pointer ${
                  statusFilter === s
                    ? "bg-[#17302A] text-white"
                    : "bg-[#FAFAF8] border border-[#EEEEEA] text-[#5F6B66] hover:bg-[#EEEEEA]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Projects Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FAFAF8] border-b border-[#EEEEEA] text-[12px] uppercase font-semibold text-[#5F6B66]">
              <tr>
                <th className="py-3.5 px-6">Group &amp; Project Title</th>
                <th className="py-3.5 px-4">Domain</th>
                <th className="py-3.5 px-4">Allocated Supervisor</th>
                <th className="py-3.5 px-4">Version &amp; Novelty</th>
                <th className="py-3.5 px-4">Coordinator Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEA]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#5F6B66]">
                    No projects found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F9F9F8] transition-colors">
                    <td className="py-4 px-6">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#E6E9E6] text-[#17302A] mb-1">
                        {p.group_name}
                      </span>
                      <div className="font-bold text-[#17302A] line-clamp-1 max-w-[280px]" title={p.title}>
                        {p.title}
                      </div>
                      <div className="text-[12px] text-[#5F6B66]">
                        Lead: {p.student_name} ({p.student_email})
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-[12px] font-medium px-2 py-0.5 rounded bg-[#E1F4EA] text-[#0B5A3E]">
                        {p.domain}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#17302A]">
                        {p.supervisor_name || "Unassigned"}
                      </div>
                      <div className={`text-[11px] ${p.supervisor_name ? "text-[#0B5A3E]" : "text-amber-700"}`}>
                        {p.supervisor_name ? "Allocated Faculty" : "Pending Allocation"}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-[13px] font-semibold text-[#17302A]">v{p.version}.0</div>
                      <div className="text-[11px] text-[#5F6B66]">{p.originality_score}% Originality</div>
                    </td>

                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          p.coordinator_status.includes("Approved")
                            ? "green"
                            : p.coordinator_status.includes("Revision")
                            ? "amber"
                            : "blue"
                        }
                        size="sm"
                      >
                        {p.coordinator_status}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedDossier(p)}
                        className="rounded-[8px] bg-[#EEEEEA] hover:bg-[#E0E0DC] text-[#17302A] text-[12px] font-bold px-3 py-1.5 transition-colors cursor-pointer"
                      >
                        Dossier
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Academic Project Dossier Modal */}
      {selectedDossier && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedDossier(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#EEEEEA] overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#17302A] text-white px-6 py-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/15 text-[#EBB44B]">
                    Academic Project Dossier
                  </span>
                  <span className="text-[12px] text-white/70 font-mono">
                    {selectedDossier.group_name}
                  </span>
                </div>
                <h2 className="text-xl font-bold leading-snug">
                  {selectedDossier.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDossier(null)}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg w-8 h-8 flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto text-[#17302A]">
              {/* Quick Key-Value Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#EEEEEA]">
                  <span className="text-[11px] uppercase font-bold text-[#5F6B66] block">Domain</span>
                  <span className="text-[13px] font-bold text-[#0B5A3E] mt-0.5 block">{selectedDossier.domain || "General"}</span>
                </div>
                <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#EEEEEA]">
                  <span className="text-[11px] uppercase font-bold text-[#5F6B66] block">Version</span>
                  <span className="text-[13px] font-bold mt-0.5 block">v{selectedDossier.version || 1}.0</span>
                </div>
                <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#EEEEEA]">
                  <span className="text-[11px] uppercase font-bold text-[#5F6B66] block">Originality</span>
                  <span className="text-[13px] font-bold text-[#0B5A3E] mt-0.5 block">{selectedDossier.originality_score || 94}%</span>
                </div>
                <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#EEEEEA]">
                  <span className="text-[11px] uppercase font-bold text-[#5F6B66] block">Supervisor Authority</span>
                  <span className="text-[13px] font-bold text-emerald-700 mt-0.5 block">{selectedDossier.status || "Approved"}</span>
                </div>
              </div>

              {/* Group Roster and Members */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66]">Group Composition &amp; Students</h3>
                <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#EEEEEA] space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEA]">
                    <div>
                      <span className="text-xs font-bold text-[#17302A]">Project Lead: </span>
                      <span className="text-xs text-[#5F6B66] font-medium">{selectedDossier.student_name}</span>
                    </div>
                    <span className="text-xs font-mono text-[#5F6B66]">{selectedDossier.student_email}</span>
                  </div>
                  {selectedDossier.group_members && (
                    <div className="pt-1">
                      <span className="text-xs font-bold text-[#17302A] block mb-1">Registered Group Members:</span>
                      <div className="text-xs text-[#2C3833] bg-white p-2.5 rounded-lg border border-[#EEEEEA] font-medium leading-relaxed">
                        {selectedDossier.group_members}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Faculty Supervision Allocation */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66]">Assigned Faculty Supervisor</h3>
                <div className="p-4 bg-[#F2F8F5] rounded-xl border border-[#D5E9DE] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#0B5A3E]">
                      {selectedDossier.supervisor_name || "Unassigned"}
                    </div>
                    <div className="text-xs text-[#5F6B66]">
                      {selectedDossier.supervisor_name ? "Allocated by Department Coordinator" : "Awaiting Coordinator Allocation"}
                    </div>
                  </div>
                  <Badge variant={selectedDossier.supervisor_name ? "green" : "amber"} size="sm">
                    {selectedDossier.coordinator_status || "Supervisor Allocated"}
                  </Badge>
                </div>
              </div>

              {/* Technology Stack */}
              {selectedDossier.tech_stack && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66]">Technology Stack</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDossier.tech_stack.split(",").map((tech, i) => (
                      <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#EEEEEA] text-[#17302A]">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Abstract / Problem Statement */}
              {selectedDossier.abstract && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66]">Abstract &amp; Problem Statement</h3>
                  <p className="text-xs leading-relaxed text-[#5F6B66] bg-[#FAFAF8] p-4 rounded-xl border border-[#EEEEEA]">
                    {selectedDossier.abstract}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#EEEEEA] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDossier(null)}
                className="px-4 py-2 rounded-xl bg-[#17302A] text-white text-xs font-bold hover:bg-[#23443C] transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
