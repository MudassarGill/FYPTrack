import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getMyProjects,
  getProjectFeedback,
  getProjectDocuments,
} from "../../services/api";

import { getStoredUser } from "../../services/auth";

export default function Project() {
  const user = getStoredUser();
  const [project, setProject] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectData();
  }, []);

  async function loadProjectData() {
    try {
      setLoading(true);
      const projs = await getMyProjects();
      if (projs && projs.length > 0) {
        const p = projs[0];
        setProject(p);
        const [fbList, docList] = await Promise.all([
          getProjectFeedback(p.id).catch(() => []),
          getProjectDocuments(p.id).catch(() => []),
        ]);
        setFeedbacks(fbList || []);
        setDocs(docList || []);
      }
    } catch (err) {
      console.error("Failed to load project details:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!loading && !project) {
    return (
      <div className="space-y-8 pb-12">
        <div>
          <h1 className="font-['Bricolage_Grotesque'] text-[30px] font-bold text-[#17302A] leading-tight">
            My Project
          </h1>
          <p className="text-[14px] text-[#5F6B66] mt-1">
            Comprehensive project profile, supervisor reviews, and team member management.
          </p>
        </div>
        <div className="card-base text-center py-16">
          <div className="w-16 h-16 rounded-full bg-[#F3F4F6] text-[#5F6B66] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#5F6B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h2 className="font-['Bricolage_Grotesque'] text-[22px] font-bold text-[#17302A] mb-2">
            No Active FYP Project Found
          </h2>
          <p className="text-[14px] text-[#5F6B66] max-w-md mx-auto mb-6">
            You have not submitted a project proposal yet. Submit your FYP proposal to begin milestones and supervisor collaboration.
          </p>
          <Link
            to="/student/proposal"
            className="inline-flex items-center gap-2 rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-6 py-3 transition-colors"
          >
            Submit Proposal Now &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const p = project || {};
  const rawMembers = p.group_members
    ? p.group_members.split(/[,;\n]+/).map((m) => m.trim()).filter(Boolean)
    : [p.student_name || user?.full_name || "Lead Student"];


  return (
    <div className="space-y-8 pb-12">
      {/* Header = H1 30px Bricolage + muted subtitle */}
      <div>
        <h1 className="font-['Bricolage_Grotesque'] text-[30px] font-bold text-[#17302A] leading-tight">
          My Project
        </h1>
        <p className="text-[14px] text-[#5F6B66] mt-1">
          Comprehensive project profile, supervisor reviews, and team member management.
        </p>
      </div>

      {/* Wide card (badge, title, domain and start date, overall progress 43%) */}
      <div className="card-base">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#E3EEF9] text-[#1E3A8A] w-fit">
            {p.status || "In Progress"}
          </span>
          <div className="text-[13px] text-[#5F6B66]">
            Group: <span className="font-semibold text-[#17302A]">{p.group_name || "Group 01"}</span>
          </div>
        </div>

        <h2 className="font-['Bricolage_Grotesque'] text-[24px] sm:text-[28px] font-bold text-[#17302A] mb-2 leading-snug">
          {p.title}
        </h2>

        <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#5F6B66] mb-5">
          <span>Domain: <span className="font-semibold text-[#17302A]">{p.domain}</span></span>
          <span>&bull;</span>
          <span>Supervisor: <span className="font-semibold text-[#17302A]">{p.supervisor_name || "Pending Allocation"}</span></span>
          <span>&bull;</span>
          <span>Originality: <span className="font-semibold text-[#0B5A3E]">{p.originality_score || 94}% Unique</span></span>
        </div>

        <p className="text-[14px] text-[#5F6B66] leading-relaxed mb-6">
          {p.abstract}
        </p>

        {/* Overall progress */}
        <div>
          <div className="flex justify-between items-center text-[13px] mb-2">
            <span className="font-semibold text-[#17302A]">Overall Milestone Progress</span>
            <span className="font-bold text-[#17302A]">{p.status?.includes("Approved") ? "70%" : "43%"}</span>
          </div>
          <div className="w-full h-2 bg-[#E6E9E6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#17302A] rounded-full"
              style={{ width: p.status?.includes("Approved") ? "70%" : "43%" }}
            />
          </div>
        </div>
      </div>

      {/* 2fr / 1fr Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2fr): Supervisor Feedback and Recent Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Supervisor Feedback */}
          <div className="card-base flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                  Supervisor Feedback
                </h3>
                <Link
                  to="/student/feedback"
                  className="text-[13px] font-semibold text-[#17302A] hover:text-[#C2410C] transition-colors"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-4">
                {feedbacks.length > 0 ? (
                  feedbacks.slice(0, 3).map((fb) => (
                    <div key={fb.id} className="bg-[#F8F9F8] border border-[#E6E6E1] rounded-[12px] p-4">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-[14px] text-[#17302A]">
                          {fb.from_user_name || "Supervisor"} ({fb.from_role || "Review"})
                        </span>
                        <span className="text-[12px] text-[#5F6B66]">
                          {fb.created_at ? new Date(fb.created_at).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#5F6B66] leading-relaxed mt-2">
                        "{fb.message}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#F8F9F8] border border-[#E6E6E1] rounded-[12px] p-4 text-[13px] text-[#5F6B66]">
                    No feedback messages logged yet. Use the discussion page to message your supervisor.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#EEEEEA] mt-5">
              <Link
                to="/student/feedback"
                className="inline-block rounded-[10px] border-[1.5px] border-[#17302A] text-[#17302A] hover:bg-[#17302A] hover:text-white font-bold text-[13px] px-[16px] py-[8px] transition-colors"
              >
                Submit Response or Inquiry
              </Link>
            </div>
          </div>

          {/* Card: Recent Documents */}
          <div className="card-base flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                  Recent Documents
                </h3>
                <Link
                  to="/student/documents"
                  className="text-[13px] font-semibold text-[#17302A] hover:text-[#C2410C] transition-colors"
                >
                  Manage files
                </Link>
              </div>

              <div className="space-y-3">
                {docs.length > 0 ? (
                  docs.slice(0, 3).map((d) => (
                    <div key={d.id} className="flex items-center justify-between py-2.5 border-b border-[#EEEEEA]">
                      <div>
                        <div className="font-semibold text-[14px] text-[#17302A]">
                          {d.file_name}
                        </div>
                        <div className="text-[12px] text-[#5F6B66]">
                          {d.doc_type} &bull; {d.file_size || "1.5 MB"}
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${
                        d.status === "Approved" ? "bg-[#E1F4EA] text-[#0B5A3E]" : "bg-[#FEF3D6] text-[#8F5B10]"
                      }`}>
                        {d.status || "Pending"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-[13px] text-[#5F6B66] py-2">
                    No deliverables uploaded yet. Upload your first document to initiate review.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#EEEEEA] mt-5">
              <Link
                to="/student/documents"
                className="inline-block rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[13px] px-[16px] py-[8px] transition-colors shadow-sm"
              >
                Upload New Deliverable
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1fr): Supervisor and Group Members cards */}
        <div className="space-y-6">
          {/* Card: Supervisor */}
          <div className="card-base flex flex-col justify-between">
            <div>
              <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-4">
                Supervisor
              </h3>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-[48px] h-[48px] rounded-full bg-[#EBB44B] text-[#17302A] font-['Bricolage_Grotesque'] font-bold text-[18px] flex items-center justify-center shrink-0">
                  {(p.supervisor_name || "Fac")
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="font-['Bricolage_Grotesque'] font-bold text-[16px] text-[#17302A]">
                    {p.supervisor_name || "Pending Faculty Allocation"}
                  </div>
                  <div className="text-[12px] text-[#5F6B66]">
                    {p.supervisor_name ? "Department Supervisor" : "Coordinator Reviewing"}
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-[#5F6B66] leading-relaxed mb-4">
                Domain: <span className="font-medium text-[#17302A]">{p.domain}</span><br />
                Status: <span className="font-medium text-[#17302A]">{p.status || "In Review"}</span>
              </p>
            </div>
            <div className="pt-3 border-t border-[#EEEEEA]">
              <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${
                p.supervisor_name ? "text-[#0B5A3E] bg-[#E1F4EA]" : "text-amber-800 bg-amber-100"
              }`}>
                {p.supervisor_name ? "Allocated Faculty" : "Awaiting Allocation"}
              </span>
            </div>
          </div>

          {/* Card: Group Members */}
          <div className="card-base flex flex-col justify-between">
            <div>
              <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-4">
                Group Members
              </h3>
              <div className="space-y-3.5">
                {rawMembers.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 border-b border-[#EEEEEA] last:border-0">
                    <div>
                      <div className="text-[14px] font-semibold text-[#17302A]">{m}</div>
                      <div className="text-[12px] text-[#5F6B66]">{idx === 0 ? "Project Lead" : "Team Member"}</div>
                    </div>
                    {idx === 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECECE8] text-[#4A5651]">
                        Lead
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-[#EEEEEA] text-[12px] text-[#5F6B66]">
              {p.group_name || "Group"} &bull; {rawMembers.length} member{rawMembers.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
