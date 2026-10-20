import { useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";

const initialDocuments = [
  {
    id: 1,
    docName: "Software Requirements Specification (SRS)",
    version: "v2.1",
    group: "Group 14",
    student: "Ayesha Noor",
    fileSize: "4.2 MB",
    fileFormat: "PDF",
    submittedAt: "Today, 09:30 AM",
    status: "Pending Review",
    variant: "blue",
    notes: "Updated section 4.2 with detailed functional requirements based on previous feedback.",
    reviewNotes: "",
    rating: null,
  },
  {
    id: 2,
    docName: "System Architecture & High-Level Design",
    version: "v1.0",
    group: "Group 08",
    student: "Bilal Farooq",
    fileSize: "6.8 MB",
    fileFormat: "PDF",
    submittedAt: "Yesterday, 3:15 PM",
    status: "Pending Review",
    variant: "blue",
    notes: "Complete sensor bus topology and ROS 2 middleware architecture diagrams included.",
    reviewNotes: "",
    rating: null,
  },
  {
    id: 3,
    docName: "Firmware Source Code Archive",
    version: "v1.2",
    group: "Group 21",
    student: "Hassan Raza",
    fileSize: "18.4 MB",
    fileFormat: "ZIP",
    submittedAt: "17 Oct 2026",
    status: "Reviewed",
    variant: "green",
    notes: "Contains compiled firmware builds and MQTT broker test suites.",
    reviewNotes: "Code structured well. All test harnesses passed clean without memory leaks.",
    rating: "Approved (A)",
  },
  {
    id: 4,
    docName: "Literature Review & Problem Formulation",
    version: "v1.0",
    group: "Group 33",
    student: "Usman Tariq",
    fileSize: "2.1 MB",
    fileFormat: "PDF",
    submittedAt: "15 Oct 2026",
    status: "Needs Revision",
    variant: "amber",
    notes: "First draft submission of healthcare federated learning survey.",
    reviewNotes: "Include more recent 2024-2025 IEEE transactions in Section 2 benchmarking.",
    rating: "Revision Required",
  },
];

export default function DocumentReviews() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [filter, setFilter] = useState("All");
  const [activeDoc, setActiveDoc] = useState(null);
  const [reviewInput, setReviewInput] = useState("");
  const [decision, setDecision] = useState("Reviewed");

  const filtered = documents.filter((d) => {
    if (filter === "All") return true;
    return d.status.toLowerCase() === filter.toLowerCase();
  });

  const handleSaveReview = (e) => {
    e.preventDefault();
    setDocuments(
      documents.map((d) =>
        d.id === activeDoc.id
          ? {
              ...d,
              status: decision,
              variant: decision === "Reviewed" ? "green" : "amber",
              reviewNotes: reviewInput,
              rating: decision === "Reviewed" ? "Approved" : "Revision Required",
            }
          : d
      )
    );
    setActiveDoc(null);
    setReviewInput("");
    alert("Document review and feedback recorded successfully!");
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Document Reviews"
        description="Inspect submitted milestone documents, review code repositories, and provide official academic evaluations."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            {documents.filter((d) => d.status === "Pending Review").length} Pending Review
          </span>
        }
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", "Pending Review", "Reviewed", "Needs Revision"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-semibold transition-colors cursor-pointer ${
              filter === f
                ? "bg-[#17302A] text-white"
                : "bg-white border border-[#E6E6E1] text-[#5F6B66] hover:bg-[#F4F4F2]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Documents Grid / Table */}
      <div className="space-y-4">
        {filtered.map((doc) => (
          <Card key={doc.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EEEEEA]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] font-bold px-2 py-0.5 rounded bg-[#17302A] text-white">
                    {doc.group}
                  </span>
                  <span className="text-[12px] font-bold px-2 py-0.5 rounded bg-[#EEEEEA] text-[#17302A]">
                    {doc.version}
                  </span>
                  <span className="text-[12px] text-[#5F6B66]">
                    Submitted by {doc.student} • {doc.submittedAt}
                  </span>
                </div>
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                  {doc.docName}
                </h3>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[12px] font-semibold text-[#5F6B66]">
                  {doc.fileSize} ({doc.fileFormat})
                </span>
                <Badge variant={doc.variant} size="sm">
                  {doc.status}
                </Badge>
              </div>
            </div>

            <div className="py-3 text-[14px] text-[#5F6B66] leading-relaxed">
              <span className="font-semibold text-[#17302A]">Student Submission Note: </span>
              {doc.notes}
            </div>

            {doc.reviewNotes && (
              <div className="p-3.5 rounded-xl bg-[#F9F9F8] border border-[#EEEEEA] text-[13px] text-[#17302A] mb-3">
                <span className="font-bold text-[#0B5A3E]">Your Review Comments: </span>
                <span>{doc.reviewNotes}</span>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => alert(`Downloading ${doc.docName} (${doc.version})...`)}
                className="text-[13px] font-bold text-[#17302A] hover:text-[#C2410C] flex items-center gap-1.5 cursor-pointer"
              >
                &darr; Download File ({doc.fileFormat})
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveDoc(doc);
                  setReviewInput(doc.reviewNotes || "");
                  setDecision(doc.status === "Needs Revision" ? "Needs Revision" : "Reviewed");
                }}
                className="rounded-[8px] bg-[#17302A] hover:bg-[#24493F] text-white text-[12px] font-bold px-4 py-2 transition-colors cursor-pointer"
              >
                {doc.reviewNotes ? "Update Review" : "Record Review"}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Review Modal */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-lg w-full shadow-2xl space-y-4 border border-[#E6E6E1]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-0.5 rounded-full">
                  {activeDoc.group} • {activeDoc.version}
                </span>
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mt-1">
                  Review: {activeDoc.docName}
                </h3>
              </div>
              <button
                onClick={() => setActiveDoc(null)}
                className="text-[#5F6B66] hover:text-[#17302A] text-[20px] font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                  Review Verdict
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                    <input
                      type="radio"
                      name="verdict"
                      value="Reviewed"
                      checked={decision === "Reviewed"}
                      onChange={(e) => setDecision(e.target.value)}
                    />
                    <span className="font-semibold text-[#0B5A3E]">Approve Document</span>
                  </label>
                  <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                    <input
                      type="radio"
                      name="verdict"
                      value="Needs Revision"
                      checked={decision === "Needs Revision"}
                      onChange={(e) => setDecision(e.target.value)}
                    />
                    <span className="font-semibold text-[#991B1B]">Request Revisions</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                  Evaluation Feedback & Remarks
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewInput}
                  onChange={(e) => setReviewInput(e.target.value)}
                  placeholder="Detail your critique, required modifications, or strengths of this submission..."
                  className="w-full rounded-[10px] border border-[#D3D8D4] bg-white p-3 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveDoc(null)}
                  className="px-4 py-2 rounded-[10px] border border-[#D3D8D4] text-[13px] font-bold text-[#5F6B66] hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[10px] bg-[#17302A] hover:bg-[#24493F] text-white text-[13px] font-bold transition-colors cursor-pointer"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
