import { useState } from "react";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import PageHeader from "../../components/shared/PageHeader";
import { supervisorFeedback as initialFeedback, supervisor } from "../../data/mock";

export default function Feedback() {
  const [feedbackList, setFeedbackList] = useState(initialFeedback);
  const [replyText, setReplyText] = useState("");
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replySent, setReplySent] = useState(false);

  function handleSendReply(id) {
    if (!replyText.trim()) return;
    setReplySent(true);
    setTimeout(() => {
      setReplySent(false);
      setReplyText("");
      setReplyTargetId(null);
    }, 2000);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Supervisor & Coordinator Feedback"
        description="Structured comments and evaluation notes attached directly to your milestone deliverables."
      />

      {/* Main Feedback List */}
      <div className="space-y-6">
        {feedbackList.map((item) => (
          <Card
            key={item.id}
            className={`p-6 sm:p-7 ${
              !item.read ? "border-l-4 border-l-[#EBB44B]" : "bg-white"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6E6E1]">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-[#17302A] text-white font-['Bricolage_Grotesque'] font-bold text-xs flex items-center justify-center">
                  {item.from
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div>
                  <h3 className="font-['Bricolage_Grotesque'] text-base font-bold text-[#17302A]">
                    {item.from}
                  </h3>
                  <p className="text-xs text-[#5F6B66]">{item.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="blue">
                  {item.milestone}
                </Badge>
                {!item.read && (
                  <Badge variant="amber">
                    Unread
                  </Badge>
                )}
              </div>
            </div>

            <p className="py-4 text-sm text-[#17302A] leading-relaxed">
              {item.message}
            </p>

            {/* Reply Section */}
            <div className="pt-3 border-t border-[#E6E6E1]">
              {replyTargetId === item.id ? (
                <div className="space-y-3 mt-2">
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Write a response to ${item.from}...`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D3D8D4] text-xs focus:outline-none focus:border-[#17302A]"
                  />
                  {replySent && (
                    <p className="text-xs font-semibold text-[#0B5A3E]">
                      Response dispatched to supervisor!
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyTargetId(null)}
                      className="px-3.5 py-1.5 text-xs text-[#5F6B66] hover:bg-[#F4F4F2] rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendReply(item.id)}
                      className="px-4 py-1.5 text-xs font-bold bg-[#17302A] hover:bg-[#24493F] text-white rounded-lg transition-colors"
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#5F6B66]">
                    Feedback logged for Group 14
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTargetId(item.id);
                      setReplyText("");
                    }}
                    className="font-bold text-[#17302A] hover:text-[#F59E0B] transition-colors"
                  >
                    Reply to Note
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
