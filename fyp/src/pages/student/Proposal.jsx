import { useState } from "react";
import { useToast } from "../../components/shared/Toast";

export default function Proposal() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: "Crop Price Prediction and Market Advisory System",
    domain: "Machine Learning",
    abstract:
      "A deep learning and time-series model analyzing historical mandi arrival volumes and weather metrics to predict future wholesale market price fluctuations for major seasonal cash crops.",
    technologies: "Python, FastAPI, TensorFlow, React, PostgreSQL",
    fileName: "Proposal_Crop_Prediction_v2.pdf",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast("Proposal submitted for coordinator review successfully!");
  };

  const handleSaveDraft = () => {
    addToast("Draft proposal saved successfully.", "info");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header = H1 30px Bricolage + muted subtitle + amber badge "Under review" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-['Bricolage_Grotesque'] text-[30px] font-bold text-[#17302A] leading-tight">
              My Proposal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#FEF3D6] text-[#6B4700]">
              Under review
            </span>
          </div>
          <p className="text-[14px] text-[#5F6B66] mt-1">
            Submit your idea. AI checks similarity, the coordinator approves.
          </p>
        </div>
      </div>

      {/* 2fr / 1fr Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Form card (2fr) */}
        <div className="lg:col-span-2 card-base">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Project Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                  Domain
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                >
                  <option value="Machine Learning">Machine Learning &amp; AI</option>
                  <option value="Cloud Computing">Cloud Computing &amp; DevOps</option>
                  <option value="Cybersecurity">Cybersecurity &amp; Forensics</option>
                  <option value="IoT">IoT &amp; Embedded Systems</option>
                  <option value="Full Stack">Full Stack Web &amp; Mobile</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                  Core Technologies
                </label>
                <input
                  type="text"
                  required
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Abstract / Description
              </label>
              <textarea
                rows={5}
                required
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6] resize-none"
              />
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Proposal Document (PDF)
              </label>
              <div className="border-2 border-dashed border-[#D3D8D4] rounded-[14px] p-6 text-center bg-[#F8F9F8] hover:bg-white transition-colors">
                <div className="text-[14px] font-medium text-[#17302A]">
                  Attached: <span className="font-bold">{formData.fileName}</span> (2.4 MB)
                </div>
                <p className="text-[12px] text-[#5F6B66] mt-1 mb-3">
                  Upload replacement PDF document up to 20 MB
                </p>
                <label className="inline-block rounded-[10px] border-[1.5px] border-[#17302A] text-[#17302A] font-bold text-[13px] px-[16px] py-[8px] cursor-pointer hover:bg-[#17302A] hover:text-white transition-colors">
                  Browse files
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFormData({ ...formData, fileName: e.target.files[0].name });
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Buttons: amber "Submit Proposal" + outline "Save Draft" */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="submit"
                className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors cursor-pointer shadow-sm"
              >
                Submit Proposal
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="rounded-[10px] border-[1.5px] border-[#17302A] text-[#17302A] hover:bg-[#17302A] hover:text-white font-bold text-[14px] px-[18px] py-[11px] transition-colors cursor-pointer"
              >
                Save Draft
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Review Status rows & Supervisor card (1fr) */}
        <div className="space-y-6">
          {/* Card: Review Status */}
          <div className="card-base">
            <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-4">
              Review Status
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between py-2 border-b border-[#EEEEEA]">
                <div>
                  <div className="text-[14px] font-semibold text-[#17302A]">Submitted</div>
                  <div className="text-[12px] text-[#5F6B66]">15 Sep 2026</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#E1F4EA] text-[#0B5A3E]">
                  Approved
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#EEEEEA]">
                <div>
                  <div className="text-[14px] font-semibold text-[#17302A]">AI Similarity Check</div>
                  <div className="text-[12px] text-[#5F6B66]">6% similarity flagged</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#E1F4EA] text-[#0B5A3E]">
                  94% Unique
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#EEEEEA]">
                <div>
                  <div className="text-[14px] font-semibold text-[#17302A]">Coordinator Review</div>
                  <div className="text-[12px] text-[#5F6B66]">Domain alignment confirmed</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#FEF3D6] text-[#6B4700]">
                  In review
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-[14px] font-semibold text-[#17302A]">Supervisor Assigned</div>
                  <div className="text-[12px] text-[#5F6B66]">Slot reservation active</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#E3EEF9] text-[#1E3A8A]">
                  Assigned
                </span>
              </div>
            </div>
          </div>

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
              <p className="text-[13px] text-[#5F6B66] leading-relaxed">
                Topic match: <span className="font-bold text-[#17302A]">92%</span> &bull; 2 free slots
              </p>
            </div>
            <div className="pt-3 border-t border-[#EEEEEA] mt-4">
              <span className="text-[12px] font-semibold text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-1 rounded-full">
                AI Recommendation Accepted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
