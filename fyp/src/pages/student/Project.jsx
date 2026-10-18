import { useState } from "react";
import { Link } from "react-router-dom";

export default function Project() {
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
            In Progress
          </span>
          <div className="text-[13px] text-[#5F6B66]">
            Started: <span className="font-semibold text-[#17302A]">15 Sep 2026</span>
          </div>
        </div>

        <h2 className="font-['Bricolage_Grotesque'] text-[24px] sm:text-[28px] font-bold text-[#17302A] mb-2 leading-snug">
          Crop Price Prediction and Market Advisory System
        </h2>

        <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#5F6B66] mb-5">
          <span>Domain: <span className="font-semibold text-[#17302A]">Machine Learning &amp; AI</span></span>
          <span>&bull;</span>
          <span>Department: <span className="font-semibold text-[#17302A]">Computer Science</span></span>
          <span>&bull;</span>
          <span>Academic Year: <span className="font-semibold text-[#17302A]">2026-2027</span></span>
        </div>

        <p className="text-[14px] text-[#5F6B66] leading-relaxed mb-6">
          Machine learning system forecasting wholesale mandi commodity rates and advising smallholder farmers on optimal crop selling windows across seasonal cycles.
        </p>

        {/* Overall progress 43% with 8px bar */}
        <div>
          <div className="flex justify-between items-center text-[13px] mb-2">
            <span className="font-semibold text-[#17302A]">Overall Milestone Progress</span>
            <span className="font-bold text-[#17302A]">43%</span>
          </div>
          <div className="w-full h-2 bg-[#E6E9E6] rounded-full overflow-hidden">
            <div className="h-full bg-[#17302A] rounded-full" style={{ width: "43%" }} />
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
                <div className="bg-[#F8F9F8] border border-[#E6E6E1] rounded-[12px] p-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-[14px] text-[#17302A]">
                      SRS Document Review
                    </span>
                    <span className="text-[12px] text-[#5F6B66]">28 Oct 2026</span>
                  </div>
                  <p className="text-[13px] text-[#5F6B66] leading-relaxed mt-2">
                    "The requirements specification is clear. Ensure the latency constraints for batch model inference are formally specified in Section 4.5."
                  </p>
                </div>

                <div className="bg-[#F8F9F8] border border-[#E6E6E1] rounded-[12px] p-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-[14px] text-[#17302A]">
                      Proposal Defense Notes
                    </span>
                    <span className="text-[12px] text-[#5F6B66]">15 Oct 2026</span>
                  </div>
                  <p className="text-[13px] text-[#5F6B66] leading-relaxed mt-2">
                    "Solid defense presentation. The committee approved the topic with recommendations to validate against agricultural baseline prices from 2020-2025."
                  </p>
                </div>
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
                <div className="flex items-center justify-between py-2.5 border-b border-[#EEEEEA]">
                  <div>
                    <div className="font-semibold text-[14px] text-[#17302A]">
                      SRS_Crop_Prediction_v1.pdf
                    </div>
                    <div className="text-[12px] text-[#5F6B66]">Uploaded 28 Oct 2026 &bull; 4.1 MB</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#E1F4EA] text-[#0B5A3E]">
                    Approved
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-[#EEEEEA]">
                  <div>
                    <div className="font-semibold text-[14px] text-[#17302A]">
                      Proposal_Document_Final.pdf
                    </div>
                    <div className="text-[12px] text-[#5F6B66]">Uploaded 15 Oct 2026 &bull; 2.4 MB</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#E1F4EA] text-[#0B5A3E]">
                    Approved
                  </span>
                </div>
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
                  IS
                </div>
                <div>
                  <div className="font-['Bricolage_Grotesque'] font-bold text-[16px] text-[#17302A]">
                    Dr. Imran Shah
                  </div>
                  <div className="text-[12px] text-[#5F6B66]">Associate Professor</div>
                </div>
              </div>
              <p className="text-[13px] text-[#5F6B66] leading-relaxed mb-4">
                Email: <span className="font-medium text-[#17302A]">imran.shah@university.edu</span><br />
                Office: CS Building, Room 304<br />
                Office hours: Mon &amp; Wed 14:00 - 16:00
              </p>
            </div>
            <div className="pt-3 border-t border-[#EEEEEA]">
              <span className="text-[12px] font-semibold text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-1 rounded-full">
                Active Assignment
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
                <div className="flex items-center justify-between py-1.5 border-b border-[#EEEEEA]">
                  <div>
                    <div className="text-[14px] font-semibold text-[#17302A]">Ayesha Noor</div>
                    <div className="text-[12px] text-[#5F6B66]">FA20-BSE-042 (Lead)</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECECE8] text-[#4A5651]">
                    You
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#EEEEEA]">
                  <div>
                    <div className="text-[14px] font-semibold text-[#17302A]">Hamza Tariq</div>
                    <div className="text-[12px] text-[#5F6B66]">FA20-BSE-058</div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <div>
                    <div className="text-[14px] font-semibold text-[#17302A]">Zainab Ali</div>
                    <div className="text-[12px] text-[#5F6B66]">FA20-BSE-019</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-[#EEEEEA] text-[12px] text-[#5F6B66]">
              Group 14 &bull; 3 members
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
