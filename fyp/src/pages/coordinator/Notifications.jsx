import { useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";

const initialMemos = [
  {
    id: 1,
    title: "Mid-Term Project Defense Schedule Published",
    target: "All Students & Supervisors",
    date: "Today, 10:00 AM",
    content: "The official oral defense sessions for Phase 4 will commence from 20 Dec 2026. Hall allocations have been published on the board.",
    type: "Broadcast Memo",
    badge: "Official",
    variant: "blue",
  },
  {
    id: 2,
    title: "High Similarity Alert: Group 42 Review Requested",
    target: "Coordinator Action Required",
    date: "Yesterday",
    content: "Blockchain Degree Verification Protocol proposal overlaps 24% with thesis #CS-24-082. Adjudication required before allocation.",
    type: "System Flag",
    badge: "Urgent",
    variant: "amber",
  },
  {
    id: 3,
    title: "Supervisor Endorsement Dossier: Group 14",
    target: "Dr. Imran Shah -> Coordinator",
    date: "16 Oct 2026",
    content: "Crop Price Prediction and Market Advisory System proposal has been endorsed and forwarded for your institutional sign-off.",
    type: "Endorsement",
    badge: "Pending",
    variant: "green",
  },
];

export default function CoordinatorNotifications() {
  const { addToast } = useToast();
  const [memos, setMemos] = useState(initialMemos);
  const [showComposer, setShowComposer] = useState(false);
  const [newMemo, setNewMemo] = useState({ title: "", target: "All Students & Supervisors", content: "" });

  const handlePostBroadcast = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      title: newMemo.title,
      target: newMemo.target,
      date: "Just now",
      content: newMemo.content,
      type: "Broadcast Memo",
      badge: "Official",
      variant: "blue",
    };
    setMemos([created, ...memos]);
    setShowComposer(false);
    setNewMemo({ title: "", target: "All Students & Supervisors", content: "" });
    addToast("Department circular broadcast dispatched to all portals successfully.");
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Department Notices & Communication Center"
        description="Broadcast official circulars, review supervisor endorsement alerts, and transmit departmental calendar reminders."
        action={
          <button
            type="button"
            onClick={() => setShowComposer(!showComposer)}
            className="rounded-[10px] bg-[#17302A] hover:bg-[#24493F] text-white font-bold text-[13px] px-4 py-2 transition-colors cursor-pointer"
          >
            {showComposer ? "Close Composer" : "+ Compose Official Notice"}
          </button>
        }
      />

      {/* Composer Modal / Drawer */}
      {showComposer && (
        <Card className="p-6 border-l-4 border-l-[#EBB44B] bg-[#FFFDF8]">
          <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-3">
            Draft New Department Circular
          </h3>
          <form onSubmit={handlePostBroadcast} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1">
                  Notice Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory Defense Rehearsal Dates"
                  value={newMemo.title}
                  onChange={(e) => setNewMemo({ ...newMemo, title: e.target.value })}
                  className="w-full rounded-[10px] border border-[#D3D8D4] bg-white p-2.5 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1">
                  Target Audience
                </label>
                <select
                  value={newMemo.target}
                  onChange={(e) => setNewMemo({ ...newMemo, target: e.target.value })}
                  className="w-full rounded-[10px] border border-[#D3D8D4] bg-white p-2.5 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                >
                  <option>All Students & Supervisors</option>
                  <option>Supervisors Only</option>
                  <option>Final Year Students Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1">
                Notice Body
              </label>
              <textarea
                rows={3}
                required
                placeholder="Compose departmental instruction..."
                value={newMemo.content}
                onChange={(e) => setNewMemo({ ...newMemo, content: e.target.value })}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white p-2.5 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="px-4 py-2 rounded-[8px] border border-[#D3D8D4] text-[13px] font-bold text-[#5F6B66]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-[8px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[13px]"
              >
                Dispatch Broadcast
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Memos List */}
      <div className="space-y-4">
        {memos.map((m) => (
          <Card key={m.id} className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EEEEEA]">
              <div className="flex items-center gap-2">
                <Badge variant={m.variant} size="sm">
                  {m.badge}
                </Badge>
                <span className="text-[12px] font-semibold text-[#0B5A3E] bg-[#E1F4EA] px-2 py-0.5 rounded">
                  {m.target}
                </span>
                <span className="text-[12px] text-[#8A948F]">{m.date}</span>
              </div>
              <span className="text-[12px] text-[#5F6B66]">{m.type}</span>
            </div>

            <h4 className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A] mt-3 mb-1">
              {m.title}
            </h4>
            <p className="text-[14px] text-[#5F6B66] leading-relaxed">{m.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
