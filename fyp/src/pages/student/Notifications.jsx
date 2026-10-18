import { useState } from "react";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import PageHeader from "../../components/shared/PageHeader";
import { notifications as initialNotifications } from "../../data/mock";

export default function Notifications() {
  const [items, setItems] = useState(initialNotifications);
  const [filter, setFilter] = useState("all"); // "all" | "unread" | "deadline"

  const filteredItems = items.filter((item) => {
    if (filter === "unread") return !item.read;
    if (filter === "deadline") return item.type === "deadline";
    return true;
  });

  function markAllAsRead() {
    setItems(items.map((i) => ({ ...i, read: true })));
  }

  function toggleItemRead(id) {
    setItems(
      items.map((i) => (i.id === id ? { ...i, read: !i.read } : i))
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notifications & System Alerts"
        description="Important alerts regarding proposal approvals, deadline proximity, and supervisor evaluations."
        action={
          <button
            type="button"
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl border border-[#D3D8D4] bg-white hover:bg-[#F4F4F2] text-xs font-semibold text-[#17302A] transition-colors"
          >
            Mark All as Read
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: "all", label: "All Alerts" },
          { key: "unread", label: "Unread" },
          { key: "deadline", label: "Deadlines" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              filter === tab.key
                ? "bg-[#17302A] text-white"
                : "bg-white border border-[#E6E6E1] text-[#5F6B66] hover:text-[#17302A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredItems.map((n) => (
          <Card
            key={n.id}
            className={`p-5 transition-colors ${
              !n.read ? "bg-[#FFFDF8] border-l-4 border-l-[#EBB44B]" : "bg-white"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div className="flex items-center gap-2.5">
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-[#EBB44B] shrink-0" />
                )}
                <span className="font-['Bricolage_Grotesque'] text-base font-bold text-[#17302A]">
                  {n.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={n.type === "deadline" ? "amber" : "gray"}>
                  {n.type}
                </Badge>
                <span className="text-[11px] text-[#5F6B66]">{n.date}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#5F6B66] leading-relaxed mt-1">
              {n.message}
            </p>

            <div className="mt-3 pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => toggleItemRead(n.id)}
                className="text-xs text-[#5F6B66] hover:text-[#17302A] transition-colors"
              >
                {n.read ? "Mark as unread" : "Mark as read"}
              </button>
            </div>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <Card className="p-12 text-center text-sm text-[#5F6B66]">
            No notifications matching current filter.
          </Card>
        )}
      </div>
    </div>
  );
}
