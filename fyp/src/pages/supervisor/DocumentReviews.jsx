import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";
import {
  getMyProjects,
  getProjectDocuments,
  reviewDocumentFile,
  getDocumentDownloadUrl,
} from "../../services/api";

export default function DocumentReviews() {
  const { addToast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState(null);
  const [reviewInput, setReviewInput] = useState("");

  useEffect(() => {
    loadAllDocs();
  }, []);

  async function loadAllDocs() {
    try {
      setLoading(true);
      const myProjs = await getMyProjects();
      setProjects(myProjs || []);

      const docPromises = (myProjs || []).map((p) =>
        getProjectDocuments(p.id).then((docs) =>
          docs.map((d) => ({
            ...d,
            group_name: p.group_name,
            project_title: p.title,
            student_name: p.student_name,
          }))
        )
      );
      const nestedDocs = await Promise.all(docPromises);
      const allDocs = nestedDocs.flat();
      setDocuments(allDocs);
    } catch (err) {
      console.error("Failed to load documents for review:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleReviewDecision = async (docId, newStatus) => {
    try {
      const comment = reviewInput.trim() || `Marked as ${newStatus} by supervisor.`;
      await reviewDocumentFile(docId, newStatus, comment);
      addToast(`Document marked as '${newStatus}' and recorded in database.`);
      setActiveDoc(null);
      setReviewInput("");
      await loadAllDocs();
    } catch (err) {
      addToast(err.message || "Failed to submit document review.", "error");
    }
  };

  const handleDownload = (doc) => {
    addToast(`Downloading ${doc.file_name}...`, "info");
    window.open(getDocumentDownloadUrl(doc.id), "_blank");
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Document & Deliverable Reviews"
        description="Inspect submitted student files, specifications, and code repositories, and record official continuous evaluation notes."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            {documents.filter((d) => d.status === "Pending").length} Pending Verification
          </span>
        }
      />

      {/* Documents List */}
      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="card-base text-center py-12 text-[#5F6B66]">
            <div className="text-[16px] font-semibold text-[#17302A]">No student documents submitted yet</div>
            <p className="text-[13px] mt-1">
              When your assigned student groups upload their deliverables (SRS, Design, Code, Reports), they will appear here for verification and grading.
            </p>
          </div>
        ) : (
          documents.map((doc) => (
            <Card key={doc.id} className="p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[12px] font-bold px-2.5 py-0.5 rounded bg-[#17302A] text-white">
                      {doc.group_name}
                    </span>
                    <Badge
                      variant={
                        doc.status === "Approved"
                          ? "green"
                          : doc.status === "Changes Requested"
                          ? "amber"
                          : "blue"
                      }
                      size="sm"
                    >
                      {doc.status}
                    </Badge>
                    <span className="text-[12px] font-semibold px-2 py-0.5 rounded bg-[#FAFAF8] text-[#5F6B66] border border-[#EEEEEA]">
                      {doc.version}
                    </span>
                  </div>

                  <h3 className="font-['Bricolage_Grotesque'] text-[19px] font-bold text-[#17302A]">
                    {doc.file_name}
                  </h3>
                  <div className="text-[13px] text-[#5F6B66] mt-1">
                    Deliverable: <span className="font-semibold text-[#17302A]">{doc.doc_type}</span> &middot; Project: {doc.project_title} &middot; Student: {doc.student_name} &middot; Size: {doc.file_size} &middot; Submitted: {new Date(doc.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(doc)}
                    className="rounded-[8px] bg-[#EEEEEA] hover:bg-[#E0E0DC] text-[#17302A] text-[12px] font-bold px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    Download File
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDoc(doc);
                      setReviewInput(doc.supervisor_comment || "");
                    }}
                    className="rounded-[8px] bg-[#17302A] hover:bg-[#23483F] text-white text-[12px] font-bold px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    Review Deliverable
                  </button>
                </div>
              </div>

              {doc.supervisor_comment && (
                <div className="p-3.5 rounded-lg bg-[#FFFDF8] border border-[#F3DFAE] text-[13px] text-[#17302A]">
                  <span className="font-bold text-[#6B4700]">Supervisor Notes: </span>
                  {doc.supervisor_comment}
                </div>
              )}

              {/* Review Modal Form */}
              {activeDoc?.id === doc.id && (
                <div className="mt-3 p-4 rounded-xl bg-[#F8F9F8] border border-[#D3D8D4] space-y-3">
                  <div className="font-bold text-[14px] text-[#17302A]">
                    Evaluate {doc.file_name} ({doc.group_name})
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Enter review notes, required corrections, or approval remarks..."
                    value={reviewInput}
                    onChange={(e) => setReviewInput(e.target.value)}
                    className="w-full rounded-[8px] border border-[#D3D8D4] bg-white p-2.5 text-[13px] outline-none resize-none"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReviewDecision(doc.id, "Approved")}
                      className="px-4 py-2 rounded-[8px] bg-[#0B5A3E] hover:bg-[#094731] text-white text-[12px] font-bold cursor-pointer"
                    >
                      Approve Deliverable
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReviewDecision(doc.id, "Changes Requested")}
                      className="px-4 py-2 rounded-[8px] bg-red-100 hover:bg-red-200 text-red-800 text-[12px] font-bold cursor-pointer"
                    >
                      Request Corrections
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDoc(null)}
                      className="px-4 py-2 rounded-[8px] bg-[#ECECE8] text-[#4A5651] text-[12px] font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
