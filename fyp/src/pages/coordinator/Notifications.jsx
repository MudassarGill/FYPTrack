import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { CheckCircle2, Inbox, Trash2 } from "lucide-react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
  deleteNotification,
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

export default function CoordinatorNotifications() {
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
      console.error("Failed to load coordinator notifications:", err);
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

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setList((prev) => prev.map((n) => ({ ...n, is_read: true })));
      addToast("All notifications marked as read.");
    } catch (err) {
      console.error(err);
      addToast("Failed to mark all as read.", "error");
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      setList([]);
      addToast("All notifications cleared.");
    } catch (err) {
      addToast("Failed to clear notifications.", "error");
    }
  };

  const handleDeleteSingle = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setList((prev) => prev.filter((n) => n.id !== id));
      addToast("Notification removed.");
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const unreadCount = list.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Department Activity & System Alerts"
        description="Real-time institutional log of proposal submissions, supervisor allocations, evaluation results, and originality flags."
        action={
          list.length > 0 ? (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#17302A] hover:bg-[#24493F] text-white font-bold text-[13px] px-3.5 py-2 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#EBB44B]" />
                  Mark all as read ({unreadCount})
                </button>
              )}
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-[10px] bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-[13px] px-3.5 py-2 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                Clear All
              </button>
            </div>
          ) : (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#E1F4EA] text-[#0B5A3E]">
              All caught up
            </span>
          )
        }
      />

      {loading ? (
        <Card className="p-12 text-center text-[#5F6B66]">
          Loading department notifications...
        </Card>
      ) : list.length === 0 ? (
        <Card className="p-12 text-center text-[#5F6B66] space-y-3">
          <Inbox className="w-12 h-12 mx-auto text-[#BFC8C2]" />
          <h3 className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A]">
            No activity logged yet
          </h3>
          <p className="text-[14px] text-[#5F6B66] max-w-md mx-auto">
            System notifications and student proposal events will appear here in real time.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && handleMarkAsRead(n.id)}
              className={`p-5 rounded-[12px] border transition-all ${
                !n.is_read
                  ? "bg-white border-[#EBB44B] shadow-sm ring-1 ring-[#EBB44B]/20"
                  : "bg-[#FAFAF8] border-[#EEEEEA] opacity-90"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      !n.is_read ? "bg-[#EBB44B]" : "bg-transparent"
                    }`}
                  />
                  <h4 className="font-['Bricolage_Grotesque'] font-bold text-[16px] text-[#17302A]">
                    {n.title}
                  </h4>
                  {!n.is_read && (
                    <Badge variant="amber" size="sm">
                      New
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#8A948F]">
                    {formatRelativeTime(n.created_at)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSingle(e, n.id)}
                    title="Dismiss alert"
                    className="p-1 rounded-md text-[#9BA8A2] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-[14px] text-[#4A5651] leading-relaxed pl-5">
                {n.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
