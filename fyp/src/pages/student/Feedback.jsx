import { useState, useEffect } from "react";
import { useToast } from "../../components/shared/Toast";
import { getMyProjects, getProjectFeedback, postFeedback } from "../../services/api";

export default function Feedback() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [items, setItems] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadFeedbackData();
  }, []);

  async function loadFeedbackData() {
    try {
      setLoading(true);
      const projects = await getMyProjects();
      if (projects && projects.length > 0) {
        const p = projects[0];
        setProject(p);
        const fbList = await getProjectFeedback(p.id);
        setItems(fbList);
      }
    } catch (err) {
      console.error("Failed to load feedback:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    if (!project) {
      addToast("Please submit a proposal first before messaging.", "info");
      return;
    }
    try {
      setSending(true);
      const newFb = await postFeedback(project.id, replyText);
      setItems([...items, newFb]);
      addToast("Reply dispatched to supervisor successfully.");
      setReplyText("");
    } catch (err) {
      addToast(err.message || "Failed to send message.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-['Bricolage_Grotesque'] text-[30px] font-bold text-[#17302A] leading-tight">
          Supervisor Feedback &amp; Discussion
        </h1>
        <p className="text-[14px] text-[#5F6B66] mt-1">
          Review structured evaluation remarks and revision requests from your supervisor.
        </p>
      </div>

      {/* Main feedback feed */}
      {items.length === 0 ? (
        <div className="card-base text-center py-12">
          <div className="text-[16px] font-semibold text-[#17302A]">No feedback messages recorded yet</div>
          <p className="text-[13px] text-[#5F6B66] mt-1 max-w-md mx-auto">
            Once your supervisor reviews your proposal or deliverables, their revision notes and guidance will be listed here live.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const isSupervisor = item.from_role === "supervisor";
            const isCoordinator = item.from_role === "coordinator";
            return (
              <div key={item.id} className="card-base flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EEEEEA]">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-[40px] h-[40px] rounded-full font-['Bricolage_Grotesque'] font-bold text-[15px] flex items-center justify-center shrink-0 ${
                          isSupervisor
                            ? "bg-[#EBB44B] text-[#17302A]"
                            : isCoordinator
                            ? "bg-[#17302A] text-white"
                            : "bg-[#E1F4EA] text-[#0B5A3E]"
                        }`}
                      >
                        {item.from_user_name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <div className="font-['Bricolage_Grotesque'] font-bold text-[15px] text-[#17302A]">
                          {item.from_user_name}
                        </div>
                        <div className="text-[12px] text-[#5F6B66] capitalize">
                          {item.from_role} &bull; {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                          item.action_type === "revision_request"
                            ? "bg-red-100 text-red-800"
                            : item.action_type === "approval"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.action_type === "revision_request"
                          ? "Revision Required"
                          : item.action_type === "approval"
                          ? "Approved"
                          : "Note"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 text-[14px] text-[#17302A] leading-relaxed">
                    {item.message}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reply Box */}
      <div className="card-base">
        <h3 className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A] mb-3">
          Send Message or Clarification to Supervisor
        </h3>
        <div className="space-y-3">
          <textarea
            rows={3}
            placeholder="Type your response, clarification, or milestone progress update..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[10px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6] resize-none"
          />
          <button
            type="button"
            disabled={sending || !replyText.trim()}
            onClick={handleSendReply}
            className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[13px] px-[18px] py-[9px] transition-colors cursor-pointer disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Message to Supervisor"}
          </button>
        </div>
      </div>
    </div>
  );
}
