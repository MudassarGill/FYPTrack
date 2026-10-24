import { useState, useEffect } from "react";
import { Bell, CheckCircle2, Inbox } from "lucide-react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/api";
import { useToast } from "../../components/shared/Toast";

function formatRelativeTime(isoString, fallbackStr) {
  if (!isoString) return fallbackStr || "Recently";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return fallbackStr || "Recently";
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 45) return "Just now";
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Notifications() {
  const { addToast } = useToast();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      const data = await getNotifications();
      setList(data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setList((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setList((prev) => prev.map((n) => ({ ...n, is_read: true })));
      addToast("All notifications marked as read.");
    } catch (err) {
      addToast("Failed to mark all as read.", "error");
    }
  };

  const unreadCount = list.filter((n) => !n.is_read).length;

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
            Real-time deliverable reviews, supervisor feedback, and department academic alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <div>
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="rounded-[10px] border-[1.5px] border-[#17302A] text-[#17302A] hover:bg-[#17302A] hover:text-white font-bold text-[14px] px-[18px] py-[10px] transition-colors cursor-pointer"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>

      {/* Notifications Card List */}
      <div className="card-base">
        {loading ? (
          <div className="text-center py-12 text-[#5F6B66]">Loading notifications...</div>
        ) : list.length === 0 ? (
          <div className="text-center py-12 text-[#5F6B66] space-y-2">
            <Inbox className="w-10 h-10 mx-auto text-[#9BA8A2]" />
            <div className="text-[16px] font-semibold text-[#17302A]">No notifications yet</div>
            <p className="text-[13px] max-w-md mx-auto">
              When your supervisor reviews your deliverables or the coordinator broadcasts milestone updates, your alerts will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((item) => {
              const isUnread = !item.is_read;
              return (
                <div
                  key={item.id}
                  onClick={() => isUnread && handleMarkAsRead(item.id)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[12px] transition-colors border cursor-pointer ${
                    isUnread
                      ? "bg-[#F8FAF9] border-[#D3D8D4] hover:border-[#17302A]"
                      : "bg-white border-[#EEEEEA] hover:border-[#D3D8D4]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        isUnread ? "bg-[#EBB44B]" : "bg-transparent border border-[#BFC8C2]"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[15px] text-[#17302A]">{item.title}</span>
                        {isUnread && (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#E3EEF9] text-[#1E3A8A]">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#5F6B66] mt-0.5 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[11px] text-[#8A9691] mt-1 inline-block">
                        {formatRelativeTime(item.iso_time, item.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="sm:self-center shrink-0">
                    {isUnread ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(item.id);
                        }}
                        className="text-[12px] text-[#17302A] font-bold hover:underline cursor-pointer"
                      >
                        Mark as read
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#8A9691] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0B5A3E]" /> Read
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
