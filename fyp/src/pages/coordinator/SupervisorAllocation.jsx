import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";
import {
  getAllProjects,
  getSupervisorsList,
  assignSupervisorToProject,
  getSupervisorRecommendations,
} from "../../services/api";

export default function SupervisorAllocation() {
  const { addToast } = useToast();
  const [faculty, setFaculty] = useState([]);
  const [projects, setProjects] = useState([]);
  const [recommendationsByProject, setRecommendationsByProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFacultyForProject, setSelectedFacultyForProject] = useState({});
  const [assigningId, setAssigningId] = useState(null);

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

      // Fetch AI recommendations for all projects (unassigned and allocated)
      const recMap = {};
      const initialSelections = {};

      await Promise.all(
        (projList || []).map(async (p) => {
          try {
            const res = await getSupervisorRecommendations(p.id);
            if (res && res.recommendations && res.recommendations.length > 0) {
              recMap[p.id] = res.recommendations;
              if (!p.supervisor_name) {
                // Default selection is the top AI recommended supervisor with open slots
                const bestCandidate =
                  res.recommendations.find((r) => r.free_slots > 0) ||
                  res.recommendations[0];
                if (bestCandidate) {
                  initialSelections[p.id] = bestCandidate.id;
                }
              }
            }
          } catch {
            // Fallback gracefully
          }
        })
      );

      setRecommendationsByProject(recMap);
      setSelectedFacultyForProject((prev) => ({ ...initialSelections, ...prev }));
    } catch (err) {
      console.error("Failed to load allocation data:", err);
    } finally {
      setLoading(false);
    }
  }

  const unassigned = projects.filter((p) => !p.supervisor_name);

  const handleAssign = async (project, facultyObj) => {
    if (!facultyObj || !facultyObj.id) {
      addToast("Please select a valid faculty supervisor.", "error");
      return;
    }
    try {
      setAssigningId(project.id);
      await assignSupervisorToProject(project.id, facultyObj.id, facultyObj.name);
      addToast(`${project.group_name} (${project.title}) allocated to ${facultyObj.name} successfully!`);
      await loadData();
    } catch (err) {
      addToast(err.message || "Failed to assign supervisor.", "error");
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Supervisor Allocation & Workload Balancer"
        description="Pair student project proposals with departmental supervisors based on domain alignment, AI recommendation matching, and faculty capacity limits."
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
              {unassigned.length} Groups Pending Allocation
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#E1F4EA] text-[#0B5A3E] border border-[#B5E2CE]">
              AI Matching Active
            </span>
          </div>
        }
      />

      {/* Unassigned Student Groups */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
              Student Proposals Awaiting Supervisor Allocation ({unassigned.length})
            </h2>
            <span className="text-[13px] text-[#5F6B66]">
              AI ranks departmental faculty by technical domain expertise and live supervision capacity.
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white border border-[#EEEEEA] rounded-xl text-[#5F6B66]">
            Computing AI domain similarity matching across departmental faculty...
          </div>
        ) : unassigned.length === 0 ? (
          <Card className="text-center py-10 text-[#5F6B66]">
            <div className="font-bold text-[16px] text-[#17302A] mb-1">
              All Submitted Projects Currently Have an Allocated Supervisor
            </div>
            <p className="text-[13px]">
              New student proposal submissions will automatically appear here for AI-assisted mentor assignment.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {unassigned.map((g) => {
              const recs = recommendationsByProject[g.id] || [];
              const topRec = recs[0] || null;
              const defaultFaculty = faculty[0] || {};
              const chosenFacultyId = selectedFacultyForProject[g.id] || (topRec ? topRec.id : defaultFaculty.id);
              const chosenFaculty = faculty.find((f) => f.id === parseInt(chosenFacultyId)) || defaultFaculty;
              const chosenRec = recs.find((r) => r.id === parseInt(chosenFacultyId)) || topRec;

              return (
                <Card key={g.id} className="p-5 flex flex-col justify-between space-y-4 border border-[#E6E6E1]">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[12px] font-bold px-2.5 py-0.5 rounded bg-[#17302A] text-white">
                        {g.group_name}
                      </span>
                      <Badge variant="amber" size="sm">
                        Awaiting Mentor
                      </Badge>
                    </div>

                    <h4 className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A] line-clamp-2">
                      {g.title}
                    </h4>
                    <p className="text-[12px] text-[#5F6B66] mt-1">
                      Lead: <span className="font-semibold text-[#17302A]">{g.student_name}</span> &bull; Domain: <span className="font-semibold text-[#0B5A3E]">{g.domain}</span>
                    </p>

                    {/* AI Recommendation Highlight Card */}
                    {topRec && (
                      <div className="mt-3.5 p-3.5 rounded-xl bg-[#FAF9F5] border border-[#F0ECE1] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B4700]">
                            AI Recommendation
                          </span>
                          <span className="text-[12px] font-bold text-[#0B5A3E] bg-[#E1F4EA] border border-[#B5E2CE] px-2 py-0.5 rounded-full">
                            {topRec.ai_match_score}% Match
                          </span>
                        </div>
                        <div className="text-[13px] font-bold text-[#17302A]">
                          {topRec.name} <span className="font-normal text-[12px] text-[#5F6B66]">({topRec.designation})</span>
                        </div>
                        <div className="text-[11px] text-[#5F6B66] flex flex-wrap gap-1.5">
                          {topRec.reasons && topRec.reasons.map((r, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-white border border-[#E6E6E1] text-[#17302A]">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
                        className="w-full rounded-[8px] border border-[#D3D8D4] bg-white px-3 py-2 text-[13px] outline-none font-medium text-[#17302A]"
                      >
                        {faculty.map((f) => {
                          const rec = recs.find((r) => r.id === f.id);
                          return (
                            <option key={f.id} value={f.id}>
                              {f.name} ({f.email}) &bull; {rec ? `${rec.ai_match_score}% AI Match` : "Available"} ({f.assigned_count}/5 assigned)
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <button
                      type="button"
                      disabled={assigningId === g.id || chosenFaculty.free_slots <= 0}
                      onClick={() => handleAssign(g, chosenFaculty)}
                      className="w-full rounded-[8px] bg-[#EBB44B] hover:bg-[#DDA53A] disabled:bg-[#EEEEEA] disabled:text-[#8A948F] text-[#17302A] font-bold text-[13px] py-2.5 transition-colors cursor-pointer text-center"
                    >
                      {assigningId === g.id
                        ? "Allocating Supervisor..."
                        : chosenFaculty.free_slots <= 0
                        ? `${chosenFaculty.name} is at Capacity (5/5)`
                        : `Allocate ${chosenFaculty.name}`}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Allocated Projects with Reallocation Capability */}
        {projects.filter((p) => p.supervisor_name).length > 0 && (
          <div className="space-y-4 pt-6 border-t border-[#EEEEEA]">
            <div>
              <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                Allocated Projects & Reallocation ({projects.filter((p) => p.supervisor_name).length})
              </h2>
              <span className="text-[13px] text-[#5F6B66]">
                You can reallocate any project to a different supervisor as departmental workloads or requirements evolve.
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {projects.filter((p) => p.supervisor_name).map((g) => {
                const recs = recommendationsByProject[g.id] || [];
                const currentFac = faculty.find((f) => f.id === g.supervisor_id || f.name === g.supervisor_name) || faculty[0] || {};
                const chosenFacultyId = selectedFacultyForProject[g.id] || currentFac.id;
                const chosenFaculty = faculty.find((f) => f.id === parseInt(chosenFacultyId)) || currentFac;

                return (
                  <Card key={g.id} className="p-5 flex flex-col justify-between space-y-4 border border-[#E6E6E1]">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[12px] font-bold px-2.5 py-0.5 rounded bg-[#17302A] text-white">
                          {g.group_name}
                        </span>
                        <Badge variant="blue" size="sm">
                          Supervisor: {g.supervisor_name}
                        </Badge>
                      </div>

                      <h4 className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A] line-clamp-2">
                        {g.title}
                      </h4>
                      <p className="text-[12px] text-[#5F6B66] mt-1">
                        Lead: <span className="font-semibold text-[#17302A]">{g.student_name}</span> &bull; Domain: <span className="font-semibold text-[#0B5A3E]">{g.domain}</span>
                      </p>

                      {/* Top AI Match Highlight */}
                      {recs[0] && (
                        <div className="mt-3.5 p-3 rounded-xl bg-[#FAF9F5] border border-[#F0ECE1] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B4700]">
                              AI Recommended Supervisor
                            </span>
                            <span className="text-[11px] font-bold text-[#0B5A3E] bg-[#E1F4EA] border border-[#B5E2CE] px-2 py-0.5 rounded-full">
                              {recs[0].ai_match_score}% Match
                            </span>
                          </div>
                          <div className="text-[13px] font-bold text-[#17302A]">
                            {recs[0].name} <span className="font-normal text-[11px] text-[#5F6B66]">({recs[0].designation})</span>
                          </div>
                          <div className="text-[11px] text-[#5F6B66] flex flex-wrap gap-1">
                            {recs[0].reasons && recs[0].reasons.map((r, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-white border border-[#E6E6E1] text-[#17302A]">
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#EEEEEA] space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8A948F] mb-1">
                          Reassign to Faculty Member
                        </label>
                        <select
                          value={chosenFacultyId}
                          onChange={(e) =>
                            setSelectedFacultyForProject({
                              ...selectedFacultyForProject,
                              [g.id]: e.target.value,
                            })
                          }
                          className="w-full rounded-[8px] border border-[#D3D8D4] bg-white px-3 py-2 text-[13px] outline-none font-medium text-[#17302A]"
                        >
                          {faculty.map((f) => {
                            const rec = recs.find((r) => r.id === f.id);
                            const isCurrent = f.id === g.supervisor_id || f.name === g.supervisor_name;
                            return (
                              <option key={f.id} value={f.id}>
                                {isCurrent ? "✓ [Current] " : ""}{f.name} ({f.email}) &bull; {rec ? `${rec.ai_match_score}% Match` : "Available"} ({f.assigned_count}/5 assigned)
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <button
                        type="button"
                        disabled={assigningId === g.id || chosenFaculty.id === g.supervisor_id}
                        onClick={() => handleAssign(g, chosenFaculty)}
                        className="w-full rounded-[8px] bg-[#17302A] hover:bg-[#23483F] disabled:bg-[#EEEEEA] disabled:text-[#8A948F] text-white font-bold text-[13px] py-2.5 transition-colors cursor-pointer text-center"
                      >
                        {assigningId === g.id
                          ? "Reallocating Supervisor..."
                          : chosenFaculty.id === g.supervisor_id
                          ? `Currently Assigned to ${chosenFaculty.name}`
                          : `Reassign to ${chosenFaculty.name}`}
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Faculty Supervision Quotas */}
      <div className="space-y-4 pt-4 border-t border-[#EEEEEA]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
              Department Faculty Supervision Workload & Expertise
            </h2>
            <span className="text-[12px] text-[#5F6B66]">Institutional policy limit: 5 capstone groups per faculty member</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {faculty.map((f) => {
            const pct = Math.round((f.assigned_count / f.capacity) * 100);
            return (
              <Card key={f.id} className="p-5 flex flex-col justify-between space-y-4 border border-[#E6E6E1]">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant={f.free_slots > 0 ? "green" : "gray"} size="sm">
                      {f.free_slots > 0 ? `${f.free_slots} Slots Available` : "Quota Full"}
                    </Badge>
                    <span className="text-[12px] font-bold text-[#17302A]">
                      {f.assigned_count} / {f.capacity} Groups
                    </span>
                  </div>

                  <h3 className="font-['Bricolage_Grotesque'] text-[17px] font-bold text-[#17302A]">
                    {f.name}
                  </h3>
                  <div className="text-[12px] text-[#5F6B66]">{f.designation || "Faculty Mentor"} &bull; {f.email}</div>

                  {f.primary_domains && f.primary_domains.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {f.primary_domains.map((dom, i) => (
                        <span key={i} className="text-[11px] font-semibold bg-[#FAFAF8] text-[#5F6B66] border border-[#EEEEEA] px-2 py-0.5 rounded">
                          {dom}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="w-full bg-[#EEEEEA] rounded-full h-2 mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${f.free_slots > 0 ? "bg-[#0B5A3E]" : "bg-[#B91C1C]"}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>

                  {f.assigned_groups && f.assigned_groups.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#EEEEEA]">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A948F] mb-1">
                        Currently Supervised Projects:
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
                  <span className={`font-semibold ${f.free_slots > 0 ? "text-[#0B5A3E]" : "text-red-700"}`}>
                    {f.free_slots > 0 ? `${f.free_slots} Slots Free` : "Capacity Reached"}
                  </span>
                  <span className="text-[#8A948F] text-[11px]">Authorized Supervisor</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
