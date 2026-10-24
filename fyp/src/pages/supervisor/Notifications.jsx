import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { CheckCircle2, Inbox } from "lucide-react";
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

export default function SupervisorNotifications() {
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
      <PageHeader
        title="Faculty Notification Feed"
        description="Real-time alerts for student deliverable submissions, proposal revisions, and department milestone updates."
        action={
          unreadCount > 0 ? (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="rounded-[10px] bg-[#17302A] hover:bg-[#23483F] text-white font-bold text-[13px] px-4 py-2 transition-colors cursor-pointer"
            >
              Mark All as Read ({unreadCount})
            </button>
          ) : (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#E1F4EA] text-[#0B5A3E]">
              All caught up
            </span>
          )
        }
      />

      <div className="space-y-3">
        {loading ? (
          <div className="card-base text-center py-12 text-[#5F6B66]">Loading notifications...</div>
        ) : list.length === 0 ? (
          <div className="card-base text-center py-12 text-[#5F6B66] space-y-2">
            <Inbox className="w-10 h-10 mx-auto text-[#9BA8A2]" />
            <div className="text-[16px] font-semibold text-[#17302A]">No notifications yet</div>
            <p className="text-[13px] max-w-md mx-auto">
              When your assigned student groups upload documents, ask feedback questions, or coordinator allocates proposals, alerts will appear here.
            </p>
          </div>
        ) : (
          list.map((n) => {
            const isUnread = !n.is_read;
            return (
              <Card
                key={n.id}
                onClick={() => isUnread && handleMarkAsRead(n.id)}
                className={`p-4 transition-all border cursor-pointer ${
                  isUnread
                    ? "bg-[#F8FAF9] border-[#D3D8D4] hover:border-[#17302A]"
                    : "bg-white border-[#EEEEEA] hover:border-[#D3D8D4]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        isUnread ? "bg-[#EBB44B]" : "bg-transparent border border-[#BFC8C2]"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-['Bricolage_Grotesque'] text-[16px] font-bold text-[#17302A]">
                          {n.title}
                        </span>
                        {isUnread && (
                          <Badge variant="blue" size="sm">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-[13px] text-[#5F6B66] leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[11px] text-[#8A9691] mt-1 inline-block">
                        {formatRelativeTime(n.iso_time, n.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="sm:self-center shrink-0">
                    {isUnread ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(n.id);
                        }}
                        className="text-[12px] font-bold text-[#17302A] hover:underline cursor-pointer"
                      >
                        Mark read
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#8A9691] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0B5A3E]" /> Read
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
