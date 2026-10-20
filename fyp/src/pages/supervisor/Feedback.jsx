import { useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Card from "../../components/shared/Card";

const initialThreads = [
  {
    id: 1,
    workItem: "SRS Specification v2.1",
    group: "Group 14",
    project: "Crop Price Prediction System",
    category: "SRS",
    messages: [
      {
        sender: "Dr. Imran Shah",
        role: "Supervisor",
        time: "16 Oct 2026, 11:30 AM",
        text: "Please clarify section 4.2 data validation rules. How will missing mandi price values be imputed before feeding into the LSTM pipeline?",
      },
      {
        sender: "Ayesha Noor",
        role: "Student (Group 14)",
        time: "16 Oct 2026, 02:15 PM",
        text: "We have incorporated a forward-fill mechanism supplemented with seasonal mean smoothing for gaps exceeding 3 consecutive days.",
      },
      {
        sender: "Dr. Imran Shah",
        role: "Supervisor",
        time: "Yesterday, 10:00 AM",
        text: "Good. Please document this explicit formula in Section 4.2.3 before submitting the final PDF revision.",
      },
    ],
  },
  {
    id: 2,
    workItem: "Sensor Calibration Benchmark",
    group: "Group 08",
    project: "Autonomous Campus Shuttle Navigation",
    category: "Milestone",
    messages: [
      {
        sender: "Dr. Imran Shah",
        role: "Supervisor",
        time: "18 Oct 2026, 04:00 PM",
        text: "Your milestone deliverable is past due. Have the IMU drift calibration trials finished at the ring road?",
      },
      {
        sender: "Bilal Farooq",
        role: "Student (Group 08)",
        time: "19 Oct 2026, 09:20 AM",
        text: "Dr. Imran, we faced rain delays over the weekend. Trials are underway today and we will upload the sensor logs tonight.",
      },
    ],
  },
  {
    id: 3,
    workItem: "Proposal Scope & Novelty Review",
    group: "Group 33",
    project: "Federated Learning for Medical Imaging Privacy",
    category: "Proposal",
    messages: [
      {
        sender: "Dr. Imran Shah",
        role: "Supervisor",
        time: "14 Oct 2026, 05:00 PM",
        text: "Your proposal abstract looks promising. Make sure to specify the differential privacy epsilon budget in your threat model.",
      },
      {
        sender: "Usman Tariq",
        role: "Student (Group 33)",
        time: "15 Oct 2026, 11:45 AM",
        text: "Understood Dr. Shah. We have updated Section 3 to constrain epsilon <= 2.5 per local training epoch.",
      },
    ],
  },
];

export default function SupervisorFeedback() {
  const [threads, setThreads] = useState(initialThreads);
  const [activeCategory, setActiveCategory] = useState("All");
  const [replyText, setReplyText] = useState({});

  const categories = ["All", "Proposal", "SRS", "Milestone"];

  const filteredThreads = threads.filter((t) => {
    if (activeCategory === "All") return true;
    return t.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleSendReply = (threadId) => {
    const text = replyText[threadId];
    if (!text || !text.trim()) return;

    const newMessage = {
      sender: "Dr. Imran Shah",
      role: "Supervisor",
      time: "Just now",
      text: text.trim(),
    };

    setThreads(
      threads.map((t) =>
        t.id === threadId ? { ...t, messages: [...t.messages, newMessage] } : t
      )
    );

    setReplyText({ ...replyText, [threadId]: "" });
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Feedback & Guidance"
        description="Deliverable-attached feedback threads. All guidance remains permanently tied to its corresponding project artifact."
      />

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-semibold transition-colors cursor-pointer ${
              activeCategory === c
                ? "bg-[#17302A] text-white"
                : "bg-white border border-[#E6E6E1] text-[#5F6B66] hover:bg-[#F4F4F2]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Threads List */}
      <div className="space-y-6">
        {filteredThreads.map((thread) => (
          <Card key={thread.id} className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EEEEEA]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-bold px-2 py-0.5 rounded bg-[#17302A] text-white">
                    {thread.group}
                  </span>
                  <span className="text-[12px] font-semibold px-2 py-0.5 rounded bg-[#FEF3D6] text-[#6B4700]">
                    Attached to: {thread.workItem}
                  </span>
                </div>
                <div className="text-[13px] text-[#5F6B66] font-medium">{thread.project}</div>
              </div>

              <span className="text-[12px] font-semibold text-[#5F6B66]">
                {thread.messages.length} messages
              </span>
            </div>

            {/* Message Thread History */}
            <div className="space-y-3 pt-2">
              {thread.messages.map((m, idx) => {
                const isSupervisor = m.role.includes("Supervisor");
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl text-[14px] leading-relaxed ${
                      isSupervisor
                        ? "bg-[#F4F8F6] border border-[#D5E3DD] ml-0 md:mr-12"
                        : "bg-white border border-[#EEEEEA] mr-0 md:ml-12"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 text-[12px]">
                      <span className="font-bold text-[#17302A]">
                        {m.sender}{" "}
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            isSupervisor
                              ? "bg-[#E1F4EA] text-[#0B5A3E]"
                              : "bg-[#EEEEEA] text-[#5F6B66]"
                          }`}
                        >
                          {m.role}
                        </span>
                      </span>
                      <span className="text-[#8A948F]">{m.time}</span>
                    </div>
                    <p className="text-[#17302A]">{m.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Reply Box */}
            <div className="pt-3 border-t border-[#EEEEEA] flex gap-2">
              <input
                type="text"
                placeholder="Type your supervisory response or guidance instructions..."
                value={replyText[thread.id] || ""}
                onChange={(e) =>
                  setReplyText({ ...replyText, [thread.id]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendReply(thread.id);
                }}
                className="flex-1 rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
              />
              <button
                type="button"
                onClick={() => handleSendReply(thread.id)}
                className="rounded-[10px] bg-[#17302A] hover:bg-[#24493F] text-white font-bold text-[13px] px-5 py-2 transition-colors cursor-pointer"
              >
                Send Reply
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
