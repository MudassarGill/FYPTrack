import { useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";

const initialNotifications = [
  {
    id: 1,
    title: "New Document Submission: SRS Specification v2.1",
    desc: "Ayesha Noor (Group 14) uploaded an updated Software Requirements Specification document for your review.",
    time: "2 hours ago",
    category: "Submissions",
    read: false,
    badge: "New",
    variant: "blue",
  },
  {
    id: 2,
    title: "Milestone Overdue Alert: Group 08 Sensor Benchmark",
    desc: "Autonomous Campus Shuttle Navigation deliverable was due on 18 Oct. Send a reminder or check progress.",
    time: "Yesterday, 05:00 PM",
    category: "Deadlines",
    read: false,
    badge: "Overdue",
    variant: "amber",
  },
  {
    id: 3,
    title: "FYP Committee Memo: Mid-Term Defense Dates Announced",
    desc: "The department FYP coordinator has scheduled mid-term project defense presentations starting from 20 Dec 2026.",
    time: "2 days ago",
    category: "Memos",
    read: true,
    badge: "Official",
    variant: "gray",
  },
  {
    id: 4,
    title: "AI Similarity Verification Complete",
    desc: "Group 33 proposal document passed open-source vector similarity inspection with 96% uniqueness score.",
    time: "15 Oct 2026",
    category: "Submissions",
    read: true,
    badge: "AI Check",
    variant: "green",
  },
  {
    id: 5,
    title: "Feedback Reply Received from Group 14",
    desc: "Ayesha Noor replied to your data cleaning methodology query in SRS Specification v2.1.",
    time: "16 Oct 2026",
    category: "Submissions",
    read: true,
    badge: "Reply",
    variant: "gray",
  },
];

export default function SupervisorNotifications() {
  const [list, setList] = useState(initialNotifications);
  const [filter, setFilter] = useState("All");

  const unreadCount = list.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setList(list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setList(list.map((n) => ({ ...n, read: true })));
  };

  const filtered = list.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    return n.category.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Notifications"
        description="Stay updated with student submissions, departmental announcements, and milestone review deadlines."
        action={
          unreadCount > 0 ? (
            <button
              onClick={markAllAsRead}
              className="text-[13px] font-bold text-[#17302A] hover:text-[#C2410C] transition-colors cursor-pointer"
            >
              Mark all as read ({unreadCount})
            </button>
          ) : (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#E1F4EA] text-[#0B5A3E]">
              All caught up
            </span>
          )
        }
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", "Unread", "Submissions", "Deadlines", "Memos"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-semibold transition-colors cursor-pointer ${
              filter === f
                ? "bg-[#17302A] text-white"
                : "bg-white border border-[#E6E6E1] text-[#5F6B66] hover:bg-[#F4F4F2]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className={`p-5 transition-all ${
              !item.read ? "border-l-4 border-l-[#EBB44B] bg-[#FFFDF8]" : "bg-white"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={item.variant} size="sm">
                    {item.badge}
                  </Badge>
                  <span className="text-[12px] text-[#8A948F]">{item.time}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#EEEEEA] text-[#17302A]">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-['Bricolage_Grotesque'] text-[17px] font-bold text-[#17302A]">
                  {item.title}
                </h3>
                <p className="text-[14px] text-[#5F6B66] leading-relaxed max-w-3xl">
                  {item.desc}
                </p>
              </div>

              {!item.read && (
                <button
                  type="button"
                  onClick={() => markAsRead(item.id)}
                  className="shrink-0 text-[12px] font-bold text-[#17302A] hover:text-[#C2410C] px-3 py-1.5 rounded-[8px] bg-white border border-[#D3D8D4] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Mark as read
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
