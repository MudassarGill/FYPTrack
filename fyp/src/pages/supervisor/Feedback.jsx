import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";
import { getMyProjects, getProjectFeedback, postFeedback } from "../../services/api";

export default function SupervisorFeedback() {
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    loadThreads();
  }, []);

  async function loadThreads() {
    try {
      setLoading(true);
      const myProjs = await getMyProjects();
      setProjects(myProjs || []);

      const list = [];
      for (const p of myProjs || []) {
        const msgs = await getProjectFeedback(p.id);
        list.push({
          project: p,
          messages: msgs || [],
        });
      }
      setThreads(list);
    } catch (err) {
      console.error("Failed to load feedback threads:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSendReply = async (projectId) => {
    const text = replyText[projectId];
    if (!text || !text.trim()) return;

    try {
      await postFeedback(projectId, text.trim(), "comment");
      addToast("Feedback message sent to student group successfully.");
      setReplyText({ ...replyText, [projectId]: "" });
      await loadThreads();
    } catch (err) {
      addToast(err.message || "Failed to send feedback.", "error");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Student Guidance & Feedback"
        description="Deliverable-attached feedback threads. All guidance remains permanently tied to its corresponding student project."
      />

      <div className="space-y-6">
        {threads.length === 0 ? (
          <div className="card-base text-center py-12 text-[#5F6B66]">
            <div className="text-[16px] font-semibold text-[#17302A]">No assigned groups currently active</div>
            <p className="text-[13px] mt-1">
              Feedback threads will appear here once student groups are assigned to you by the coordinator.
            </p>
          </div>
        ) : (
          threads.map(({ project, messages }) => (
            <Card key={project.id} className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EEEEEA]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-bold px-2.5 py-0.5 rounded bg-[#17302A] text-white">
                      {project.group_name}
                    </span>
                    <span className="text-[13px] font-semibold text-[#17302A]">
                      {project.title}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#5F6B66]">
                    Student: {project.student_name} ({project.student_email}) &middot; Status: {project.status}
                  </div>
                </div>
              </div>

              {/* Message History */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {messages.length === 0 ? (
                  <div className="text-[13px] text-[#8A948F] italic py-2">
                    No messages recorded yet for this project.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isSupervisor = m.from_role === "supervisor";
                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-xl border text-[13px] ${
                          isSupervisor
                            ? "bg-[#FFFDF8] border-[#F3DFAE] ml-4 sm:ml-8"
                            : "bg-[#FAFAF8] border-[#EEEEEA] mr-4 sm:mr-8"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-[#17302A]">
                            {m.from_user_name} ({m.from_role})
                          </span>
                          <span className="text-[11px] text-[#5F6B66]">
                            {new Date(m.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[#17302A] leading-relaxed">{m.message}</p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Reply Box */}
              <div className="pt-3 border-t border-[#EEEEEA] space-y-2">
                <textarea
                  rows={2}
                  placeholder={`Send feedback or instructions to ${project.student_name}...`}
                  value={replyText[project.id] || ""}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [project.id]: e.target.value })
                  }
                  className="w-full rounded-[8px] border border-[#D3D8D4] bg-white p-2.5 text-[13px] outline-none resize-none"
                />
                <button
                  type="button"
                  onClick={() => handleSendReply(project.id)}
                  className="rounded-[8px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[13px] px-4 py-2 transition-colors cursor-pointer"
                >
                  Send Message
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
