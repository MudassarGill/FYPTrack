import { useState } from "react";
import { sampleCoordinatorWorkspace, sampleSupervisors } from "../../data/mockData";

export default function CoordinatorDashboardView() {
  const [stats, setStats] = useState(sampleCoordinatorWorkspace.stats);
  const [allocations, setAllocations] = useState(sampleCoordinatorWorkspace.pendingAllocations);
  const [alerts, setAlerts] = useState(sampleCoordinatorWorkspace.similarityAlerts);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [assignedSupervisorName, setAssignedSupervisorName] = useState(sampleSupervisors[0].name);
  const [allocationNotice, setAllocationNotice] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [announcementList, setAnnouncementList] = useState([
    {
      id: 1,
      date: "Nov 10, 2026",
      title: "Sprint 2 Deliverable Deadline Announced",
      text: "All groups must upload Sprint 2 architecture schemas and prototype videos by Nov 28, 2026 at 11:59 PM.",
    },
    {
      id: 2,
      date: "Oct 25, 2026",
      title: "FYP Plagiarism & Similarity Policy Reminder",
      text: "Any project proposal exceeding 15% similarity with archived repository projects must undergo formal committee review.",
    },
  ]);

  function handleAssignSupervisor(e) {
    e.preventDefault();
    if (!selectedGroup) return;
    setAllocations((prev) => prev.filter((a) => a.id !== selectedGroup.id));
    setStats((prev) => ({
      ...prev,
      approvedProposals: prev.approvedProposals + 1,
      pendingProposals: Math.max(0, prev.pendingProposals - 1),
    }));
    setAllocationNotice(`${selectedGroup.group} successfully allocated to ${assignedSupervisorName}!`);
    setTimeout(() => {
      setAllocationNotice("");
      setSelectedGroup(null);
    }, 2000);
  }

  function handleDismissAlert(alertId) {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    setStats((prev) => ({
      ...prev,
      highSimilarityAlerts: Math.max(0, prev.highSimilarityAlerts - 1),
    }));
  }

  function handlePostAnnouncement(e) {
    e.preventDefault();
    if (!announcement.trim()) return;
    setAnnouncementList((prev) => [
      {
        id: Date.now(),
        date: "Today",
        title: "Coordinator Notice",
        text: announcement.trim(),
      },
      ...prev,
    ]);
    setAnnouncement("");
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner: University Coordinator Header */}
      <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-[#17302B] via-[#16353b] to-[#17302B] p-6 shadow-xl sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
                Coordinator Command Desk
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300">Faculty of Computer Science &amp; IT</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              University FYP Administration &amp; Allocations
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Department-wide milestone tracking, supervisor workload balancing, and plagiarism threshold enforcement.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Session Status
              </span>
              <span className="text-sm font-bold text-emerald-400">Sprint 2 Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* University FYP Metrics Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-2xl font-black text-white">{stats.totalStudents}</div>
          <div className="text-[11px] text-slate-400">Registered Students</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-2xl font-black text-[#E9B44C]">{stats.activeGroups}</div>
          <div className="text-[11px] text-slate-400">Active FYP Groups</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-2xl font-black text-emerald-400">{stats.approvedProposals}</div>
          <div className="text-[11px] text-slate-400">Approved Proposals</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-2xl font-black text-amber-300">{stats.pendingProposals}</div>
          <div className="text-[11px] text-slate-400">Pending Allocations</div>
        </div>
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 text-center">
          <div className="text-2xl font-black text-rose-400">{stats.highSimilarityAlerts}</div>
          <div className="text-[11px] text-rose-300">Similarity Flags (&gt;15%)</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-2xl font-black text-blue-300">{stats.upcomingDefenses}</div>
          <div className="text-[11px] text-slate-400">Scheduled Defenses</div>
        </div>
      </div>

      {/* High Similarity Violation Radar Alerts */}
      {alerts.length > 0 && (
        <div className="rounded-3xl border border-rose-500/40 bg-rose-950/20 p-6 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                High Plagiarism &amp; Similarity Alerts ({alerts.length})
              </h3>
              <p className="text-xs text-rose-200/80">
                Proposals exceeding university threshold (15% maximum permitted)
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-rose-500/30 bg-black/40 p-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-400">{alert.group}</span>
                    <span className="text-slate-400">•</span>
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 font-bold text-rose-300">
                      {alert.flaggedScore}% Similarity Index
                    </span>
                  </div>
                  <h4 className="mt-1 font-semibold text-white text-sm">{alert.title}</h4>
                  <p className="mt-1 text-[11px] text-slate-300">
                    Highest overlap with: <span className="text-[#E9B44C]">{alert.matchedProject}</span>
                  </p>
                  <p className="mt-0.5 text-[10px] text-rose-300 font-medium">
                    Action: {alert.actionRequired}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDismissAlert(alert.id)}
                    className="rounded-xl bg-white/10 px-3 py-1.5 font-semibold text-slate-300 hover:bg-white/20 transition"
                  >
                    Dismiss / Exemption
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Hearing notice dispatched to ${alert.group}`)}
                    className="rounded-xl bg-rose-600 px-3.5 py-1.5 font-bold text-white hover:bg-rose-500 transition"
                  >
                    Convene Hearing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Allocation Queue & Announcements Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Student-Supervisor Allocation Queue */}
        <div className="lg:col-span-7 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Student Group Allocation Queue</h3>
              <p className="text-xs text-slate-400">Assign student research groups to faculty supervisors</p>
            </div>
            <span className="text-xs font-semibold text-[#E9B44C]">
              {allocations.length} Pending
            </span>
          </div>

          {allocationNotice && (
            <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-3 text-xs text-emerald-300">
              {allocationNotice}
            </div>
          )}

          <div className="mt-4 space-y-3">
            {allocations.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">
                All submitted groups have been assigned to supervisors!
              </p>
            ) : (
              allocations.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#E9B44C]">{item.group}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-300">{item.students.join(", ")}</span>
                    </div>
                    <div className="mt-1 font-semibold text-white text-sm">{item.title}</div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      Suggested Mentor: <span className="text-emerald-300">{item.proposedSupervisor}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedGroup(item)}
                    className="cursor-pointer rounded-xl bg-[#E9B44C] px-4 py-2 font-bold text-[#17302B] hover:bg-[#f3c873] transition self-start sm:self-auto"
                  >
                    Assign Supervisor
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Broadcast Announcements & Deadlines */}
        <div className="lg:col-span-5 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Broadcast Department Notice</h3>
            <p className="text-xs text-slate-400">
              Publish university deadlines to all student and supervisor portals.
            </p>

            <form onSubmit={handlePostAnnouncement} className="mt-4 space-y-2">
              <textarea
                rows={3}
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Enter circular or milestone deadline announcement..."
                className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-[#E9B44C]"
              />
              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-500 transition"
              >
                Broadcast to Portals
              </button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recent Broadcasts
              </h4>
              <div className="mt-3 space-y-2.5">
                {announcementList.map((ann) => (
                  <div key={ann.id} className="rounded-xl border border-white/10 bg-black/25 p-3 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-[#E9B44C]">{ann.title}</span>
                      <span>{ann.date}</span>
                    </div>
                    <p className="mt-1 text-slate-200 text-[11px] leading-relaxed">{ann.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Supervisor Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-[#E9B44C]/40 bg-[#17302B] p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              Assign Supervisor to {selectedGroup.group}
            </h3>
            <p className="mt-1 text-xs text-slate-300">{selectedGroup.title}</p>

            <form onSubmit={handleAssignSupervisor} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Select Faculty Supervisor:
                </label>
                <select
                  value={assignedSupervisorName}
                  onChange={(e) => setAssignedSupervisorName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#E9B44C]"
                >
                  {sampleSupervisors.map((sup) => (
                    <option key={sup.id} value={sup.name} className="bg-[#17302B] text-white">
                      {sup.name} — {sup.title} ({sup.capacity - sup.assignedCount} slots left)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGroup(null)}
                  className="flex-1 rounded-xl border border-white/20 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#E9B44C] py-2.5 text-xs font-bold text-[#17302B] hover:bg-[#f3c873]"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
