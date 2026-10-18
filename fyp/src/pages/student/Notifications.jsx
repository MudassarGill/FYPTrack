import { useState } from "react";

const initialNotifications = [
  {
    id: 1,
    title: "Supervisor reviewed your SRS",
    desc: "Dr. Imran Shah submitted review comments for Software Requirements Specification v1.",
    time: "2 hours ago",
    read: false,
    badge: "New",
    variant: "blue",
  },
  {
    id: 2,
    title: "Deadline reminder: Design Document",
    desc: "The System Design Document milestone is due on 12 Nov 2026. Submit through the documents portal.",
    time: "2 days ago",
    read: false,
    badge: "Reminder",
    variant: "amber",
  },
  {
    id: 3,
    title: "Proposal approved",
    desc: "Your Final Year Project proposal was formally ratified by the department FYP committee.",
    time: "1 week ago",
    read: true,
    badge: "Approved",
    variant: "green",
  },
  {
    id: 4,
    title: "AI Similarity check complete",
    desc: "Your proposal document passed plagiarism verification with 94% uniqueness index.",
    time: "2 weeks ago",
    read: true,
    badge: "System",
    variant: "gray",
  },
];

export default function Notifications() {
  const [list, setList] = useState(initialNotifications);

  const markAsRead = (id) => {
    setList(list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setList(list.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = list.filter((n) => !n.read).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header = H1 30px Bricolage + muted subtitle + mark all as read */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-['Bricolage_Grotesque'] text-[30px] font-bold text-[#17302A] leading-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#FEF3D6] text-[#6B4700]">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-[14px] text-[#5F6B66] mt-1">
            Important submission updates, milestone deadlines, and coordinator alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <div>
            <button
              type="button"
              onClick={markAllAsRead}
              className="rounded-[10px] border-[1.5px] border-[#17302A] text-[#17302A] hover:bg-[#17302A] hover:text-white font-bold text-[14px] px-[18px] py-[10px] transition-colors cursor-pointer"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>

      {/* Notifications Card List */}
      <div className="card-base">
        <div className="space-y-4">
          {list.map((item) => {
            let badgeClass = "bg-[#ECECE8] text-[#4A5651]";
            if (item.variant === "green") badgeClass = "bg-[#E1F4EA] text-[#0B5A3E]";
            if (item.variant === "amber") badgeClass = "bg-[#FEF3D6] text-[#6B4700]";
            if (item.variant === "blue") badgeClass = "bg-[#E3EEF9] text-[#1E3A8A]";

            return (
              <div
                key={item.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[12px] transition-colors border ${
                  item.read
                    ? "bg-white border-[#EEEEEA]"
                    : "bg-[#F8F9F8] border-[#D6E3D9]"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeClass}`}>
                      {item.badge}
                    </span>
                    <h4 className="font-['Bricolage_Grotesque'] text-[16px] font-bold text-[#17302A]">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[13px] text-[#5F6B66] leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="text-[11px] text-[#5F6B66] pt-0.5">{item.time}</div>
                </div>

                {!item.read && (
                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      className="rounded-[8px] bg-white border border-[#D3D8D4] hover:bg-[#17302A] hover:text-white hover:border-[#17302A] text-[#17302A] text-[12px] font-semibold px-3 py-1.5 transition-colors cursor-pointer"
                    >
                      Mark as read
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
