import { useState } from "react";

const initialFeedbackList = [
  {
    id: 1,
    from: "Dr. Imran Shah",
    role: "Supervisor",
    date: "28 Oct 2026",
    deliverable: "SRS Document Submission",
    status: "Action Required",
    variant: "amber",
    text: "The requirements specification is generally sound. However, Section 3.2 must include a rigorous mathematical definition of the rolling harvest window and data provenance pipeline for historical APMC market arrivals.",
  },
  {
    id: 2,
    from: "Dr. Imran Shah",
    role: "Supervisor",
    date: "15 Oct 2026",
    deliverable: "Proposal Defense",
    status: "Approved",
    variant: "green",
    text: "Solid presentation during defense. Make sure your research paper methodology comparison table includes SARIMA, XGBoost, and Temporal Fusion Transformers before the prototype demo.",
  },
  {
    id: 3,
    from: "FYP Coordinator Office",
    role: "Coordinator",
    date: "20 Sep 2026",
    deliverable: "Initial Proposal Submission",
    status: "Cleared",
    variant: "blue",
    text: "AI similarity check completed with 94% uniqueness. Project registered under CS Capstone track 2026.",
  },
];

export default function Feedback() {
  const [items, setItems] = useState(initialFeedbackList);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const handleSendReply = (id) => {
    if (!replyText.trim()) return;
    alert("Reply sent to supervisor!");
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header = H1 30px Bricolage + muted subtitle */}
      <div>
        <h1 className="font-['Bricolage_Grotesque'] text-[30px] font-bold text-[#17302A] leading-tight">
          Supervisor Feedback
        </h1>
        <p className="text-[14px] text-[#5F6B66] mt-1">
          Review structured evaluation comments and guidance attached to each deliverable.
        </p>
      </div>

      <div className="space-y-6">
        {items.map((item) => {
          let badgeClass = "bg-[#ECECE8] text-[#4A5651]";
          if (item.variant === "green") badgeClass = "bg-[#E1F4EA] text-[#0B5A3E]";
          if (item.variant === "amber") badgeClass = "bg-[#FEF3D6] text-[#6B4700]";
          if (item.variant === "blue") badgeClass = "bg-[#E3EEF9] text-[#1E3A8A]";

          return (
            <div key={item.id} className="card-base flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#EEEEEA]">
                  <div className="flex items-center gap-3">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#EBB44B] text-[#17302A] font-['Bricolage_Grotesque'] font-bold text-[16px] flex items-center justify-center shrink-0">
                      {item.from.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="font-['Bricolage_Grotesque'] font-bold text-[16px] text-[#17302A]">
                        {item.from}
                      </div>
                      <div className="text-[12px] text-[#5F6B66]">
                        {item.role} &bull; {item.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-medium text-[#5F6B66] hidden sm:inline">
                      {item.deliverable}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${badgeClass}`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="pt-4 text-[14px] text-[#17302A] leading-relaxed">
                  {item.text}
                </div>
              </div>

              {/* Reply section */}
              <div className="mt-5 pt-3.5 border-t border-[#EEEEEA]">
                {replyingTo === item.id ? (
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      placeholder="Write your response or question for the supervisor..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[10px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6] resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSendReply(item.id)}
                        className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[13px] px-[16px] py-[8px] transition-colors cursor-pointer"
                      >
                        Send Reply
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="rounded-[10px] border-[1.5px] border-[#17302A] text-[#17302A] font-bold text-[13px] px-[16px] py-[8px] hover:bg-[#17302A] hover:text-white transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setReplyingTo(item.id)}
                    className="rounded-[10px] border-[1.5px] border-[#17302A] text-[#17302A] hover:bg-[#17302A] hover:text-white font-bold text-[13px] px-[16px] py-[8px] transition-colors cursor-pointer"
                  >
                    Reply to feedback
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
