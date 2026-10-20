import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";
import {
  getAllProjects,
  getSupervisorsList,
  assignSupervisorToProject,
} from "../../services/api";

export default function SupervisorAllocation() {
  const { addToast } = useToast();
  const [faculty, setFaculty] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacultyForProject, setSelectedFacultyForProject] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [facList, projList] = await Promise.all([
        getSupervisorsList(),
        getAllProjects(),
      ]);
      setFaculty(facList || []);
      setProjects(projList || []);
    } catch (err) {
      console.error("Failed to load allocation data:", err);
    } finally {
      setLoading(false);
    }
  }

  const unassigned = projects.filter((p) => !p.supervisor_name);

  const handleAssign = async (project, facultyObj) => {
    try {
      await assignSupervisorToProject(project.id, facultyObj.id, facultyObj.name);
      addToast(`${project.group_name} (${project.title}) allocated to ${facultyObj.name} successfully!`);
      await loadData();
    } catch (err) {
      addToast(err.message || "Failed to assign supervisor.", "error");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Supervisor Allocation & Workload Balancer"
        description="Pair student project proposals with departmental supervisors based on domain alignment and faculty capacity limits."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            {unassigned.length} Groups Pending Allocation
          </span>
        }
      />

      {/* Unassigned Student Groups */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
            Student Proposals Awaiting Supervisor Allocation ({unassigned.length})
          </h2>
          <span className="text-[12px] text-[#5F6B66]">
            Assign faculty mentors based on topic relevance and current supervision quotas.
          </span>
        </div>

        {unassigned.length === 0 ? (
          <div className="card-base text-center py-8 text-[#5F6B66]">
            All submitted projects currently have an allocated supervisor.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unassigned.map((g) => {
              const defaultFaculty = faculty[0] || {};
              const chosenFacultyId = selectedFacultyForProject[g.id] || defaultFaculty.id;
              const chosenFaculty = faculty.find((f) => f.id === parseInt(chosenFacultyId)) || defaultFaculty;

              return (
                <Card key={g.id} className="p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[12px] font-bold px-2.5 py-0.5 rounded bg-[#17302A] text-white">
                        {g.group_name}
                      </span>
                      <Badge variant="amber" size="sm">
                        Awaiting Mentor
                      </Badge>
                    </div>

                    <h4 className="font-['Bricolage_Grotesque'] text-[17px] font-bold text-[#17302A]">
                      {g.title}
                    </h4>
                    <p className="text-[12px] text-[#5F6B66] mt-1">
                      Lead: {g.student_name} &bull; Domain: {g.domain}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EEEEEA] space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A948F] mb-1">
                        Select Supervisor to Allocate
                      </label>
                      <select
                        value={chosenFacultyId}
                        onChange={(e) =>
                          setSelectedFacultyForProject({
                            ...selectedFacultyForProject,
                            [g.id]: e.target.value,
                          })
                        }
                        className="w-full rounded-[8px] border border-[#D3D8D4] bg-white px-2.5 py-1.5 text-[13px] outline-none"
                      >
                        {faculty.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} ({f.free_slots} slots available &bull; {f.assigned_count}/5 assigned)
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAssign(g, chosenFaculty)}
                      className="w-full rounded-[8px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[13px] py-2 transition-colors cursor-pointer text-center"
                    >
                      Assign {chosenFaculty.name} &rarr;
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Faculty Supervision Quotas */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
            Department Faculty Supervision Workload
          </h2>
          <span className="text-[12px] text-[#5F6B66]">Institutional limit: 5 groups per faculty member</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {faculty.map((f) => {
            const pct = Math.round((f.assigned_count / f.capacity) * 100);
            return (
              <Card key={f.id} className="p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant={f.free_slots > 0 ? "green" : "gray"} size="sm">
                      {f.status}
                    </Badge>
                    <span className="text-[12px] font-bold text-[#17302A]">
                      {f.assigned_count} / {f.capacity} Groups
                    </span>
                  </div>

                  <h3 className="font-['Bricolage_Grotesque'] text-[17px] font-bold text-[#17302A]">
                    {f.name}
                  </h3>
                  <div className="text-[12px] text-[#5F6B66]">{f.email}</div>

                  <div className="w-full bg-[#EEEEEA] rounded-full h-2 mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${f.free_slots > 0 ? "bg-[#0B5A3E]" : "bg-[#B91C1C]"}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>

                  {f.assigned_groups && f.assigned_groups.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#EEEEEA]">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A948F] mb-1">
                        Currently Assigned Groups:
                      </div>
                      <div className="space-y-1">
                        {f.assigned_groups.map((grp, idx) => (
                          <div key={idx} className="text-[12px] text-[#17302A] truncate">
                            &bull; {grp}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#EEEEEA] flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-[#0B5A3E]">{f.free_slots} Slot Available</span>
                  <span className="text-[#5F6B66] text-[11px]">Active Faculty Mentor</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
