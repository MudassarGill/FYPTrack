import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";
import {
  getMilestones,
  updateMilestoneDeadline,
  broadcastMilestonesReminder,
} from "../../services/api";

export default function DeadlinesMilestones() {
  const { addToast } = useToast();
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDeadlines();
  }, []);

  async function loadDeadlines() {
    try {
      setLoading(true);
      const data = await getMilestones();
      setDeadlines(data || []);
    } catch (err) {
      console.error("Failed to load milestones:", err);
      addToast("Failed to load department milestones from database.", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateDeadline = async (e) => {
    e.preventDefault();
    if (!editingMilestone) return;

    try {
      setSaving(true);
      await updateMilestoneDeadline(editingMilestone.id, {
        deadline: newDate.trim(),
        status: newStatus || editingMilestone.status,
      });
      addToast(
        `Deadline for ${editingMilestone.milestone} updated to ${newDate} and broadcasted to all departmental candidates and faculty!`
      );
      setEditingMilestone(null);
      setNewDate("");
      setNewStatus("");
      await loadDeadlines();
    } catch (err) {
      addToast(err.message || "Failed to update deadline in database.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleBroadcastReminder = async () => {
    try {
      const res = await broadcastMilestonesReminder();
      addToast(res.message || "Milestone reminder broadcast sent to all students and faculty supervisors.");
    } catch (err) {
      addToast("Failed to send broadcast reminder.", "error");
    }
  };

  const getVariant = (status) => {
    if (status === "Completed") return "green";
    if (status === "Active" || status === "In progress") return "amber";
    return "gray";
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Department Academic Calendar & Deadlines"
        description="Set and publish department-wide milestones, lock submission dates, and track cohort compliance rates in real time."
        action={
          <button
            type="button"
            onClick={handleBroadcastReminder}
            className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[13px] px-4 py-2 transition-colors shadow-sm cursor-pointer"
          >
            Broadcast Milestone Reminder
          </button>
        }
      />

      {loading ? (
        <div className="card-base text-center py-12 text-[#5F6B66]">
          Loading department academic calendar...
        </div>
      ) : (
        <div className="space-y-4">
          {deadlines.map((d) => (
            <Card key={d.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#EEEEEA]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#17302A] text-white">
                      {d.phase}
                    </span>
                    <span className="text-[12px] font-semibold text-[#0B5A3E] bg-[#E1F4EA] px-2 py-0.5 rounded">
                      Weightage: {d.submission_weight}
                    </span>
                  </div>
                  <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                    {d.milestone}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[11px] text-[#5F6B66]">Official Deadline</div>
                    <div className="font-bold text-[15px] text-[#17302A]">{d.deadline}</div>
                  </div>
                  <Badge variant={getVariant(d.status)} size="sm">
                    {d.status}
                  </Badge>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[13px] text-[#5F6B66]">
                  <strong>Department Compliance: </strong>
                  {d.compliance || "Active Cohort Track"}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setEditingMilestone(d);
                    setNewDate(d.deadline);
                    setNewStatus(d.status);
                  }}
                  className="rounded-[8px] bg-[#EEEEEA] hover:bg-[#E0E0DC] text-[#17302A] text-[12px] font-bold px-3.5 py-1.5 transition-colors cursor-pointer"
                >
                  Edit Deadline
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Deadline Modal */}
      {editingMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full shadow-2xl space-y-4 border border-[#E6E6E1]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-0.5 rounded-full">
                  {editingMilestone.phase}
                </span>
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mt-1">
                  Adjust Deadline: {editingMilestone.milestone}
                </h3>
              </div>
              <button
                onClick={() => setEditingMilestone(null)}
                className="text-[#5F6B66] hover:text-[#17302A] text-[20px] font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateDeadline} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                  Official Deadline Date
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 18 Nov 2026"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-[10px] border border-[#D3D8D4] bg-white p-2.5 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                  Milestone Phase Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-[10px] border border-[#D3D8D4] bg-white p-2.5 text-[14px] outline-none focus:border-[#EBB44B]"
                >
                  <option value="Completed">Completed</option>
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="px-4 py-2 rounded-[10px] border border-[#D3D8D4] text-[13px] font-bold text-[#5F6B66] hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-[10px] bg-[#17302A] hover:bg-[#24493F] text-white text-[13px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving to Database..." : "Save & Broadcast Alert"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
