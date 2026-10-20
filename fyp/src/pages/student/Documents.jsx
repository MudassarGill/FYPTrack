import { useState, useEffect } from "react";
import { useToast } from "../../components/shared/Toast";
import {
  getMyProjects,
  getProjectDocuments,
  uploadDocumentFile,
  getDocumentDownloadUrl,
} from "../../services/api";

export default function Documents() {
  const { addToast } = useToast();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState("SRS Document");
  const [version, setVersion] = useState("v1.0");

  useEffect(() => {
    loadDocs();
  }, []);

  async function loadDocs() {
    try {
      setLoading(true);
      const projects = await getMyProjects();
      if (projects && projects.length > 0) {
        const p = projects[0];
        setProject(p);
        const docs = await getProjectDocuments(p.id);
        setFiles(docs);
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!project) {
      addToast("Please submit your project proposal first before uploading documents.", "error");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("project_id", project.id);
      formData.append("doc_type", docType);
      formData.append("version", version);
      formData.append("file", file);

      const uploaded = await uploadDocumentFile(formData);
      setFiles([uploaded, ...files]);
      addToast(`File ${file.name} uploaded successfully and queued for supervisor review!`);
    } catch (err) {
      addToast(err.message || "Failed to upload document.", "error");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDownload = (doc) => {
    addToast(`Downloading ${doc.file_name}...`, "info");
    window.open(getDocumentDownloadUrl(doc.id), "_blank");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Bricolage_Grotesque'] text-[30px] font-bold text-[#17302A] leading-tight">
            Project Documents &amp; Deliverables
          </h1>
          <p className="text-[14px] text-[#5F6B66] mt-1">
            Submit required phase deliverables for supervisor verification.
          </p>
        </div>

        {/* Upload Form inline controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-2 text-[13px] font-medium text-[#17302A] outline-none"
          >
            <option value="Proposal Document">Proposal Document</option>
            <option value="SRS Document">SRS Document</option>
            <option value="System Design">System Design</option>
            <option value="Midterm Report">Midterm Report</option>
            <option value="Source Code Archive">Source Code Archive</option>
            <option value="Final Thesis Report">Final Thesis Report</option>
          </select>

          <input
            type="text"
            placeholder="v1.0"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="w-20 rounded-[10px] border border-[#D3D8D4] bg-white px-2.5 py-2 text-[13px] outline-none"
          />

          <label className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[18px] py-[9px] transition-colors cursor-pointer shadow-sm">
            {uploading ? "Uploading..." : "Upload Document"}
            <input
              type="file"
              disabled={uploading}
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {/* Submitted Files Card */}
      <div className="card-base">
        <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-4">
          Submitted Documents ({files.length})
        </h3>

        {files.length === 0 ? (
          <div className="text-center py-10 text-[#5F6B66]">
            No documents uploaded yet. Use the upload button above to submit your proposal, SRS, or reports.
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((f) => {
              let badgeColor = "bg-[#FEF3D6] text-[#6B4700]";
              if (f.status === "Approved") badgeColor = "bg-[#E1F4EA] text-[#0B5A3E]";
              if (f.status === "Changes Requested") badgeColor = "bg-[#FEE2E2] text-[#991B1B]";

              return (
                <div
                  key={f.id}
                  className="p-4 rounded-[12px] border border-[#EEEEEA] bg-[#FAFAF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#D3D8D4] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-[42px] h-[42px] rounded-[10px] bg-[#17302A] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                      {f.file_format || "PDF"}
                    </div>
                    <div>
                      <div className="font-bold text-[15px] text-[#17302A]">
                        {f.file_name}
                      </div>
                      <div className="text-[12px] text-[#5F6B66]">
                        {f.doc_type} &bull; {f.version} &bull; {f.file_size} &bull;{" "}
                        {new Date(f.created_at).toLocaleDateString()}
                      </div>
                      {f.supervisor_comment && (
                        <div className="text-[12px] font-medium text-amber-900 mt-1">
                          Supervisor note: {f.supervisor_comment}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${badgeColor}`}>
                      {f.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownload(f)}
                      className="rounded-[8px] bg-[#EEEEEA] hover:bg-[#E0E0DC] text-[#17302A] text-[12px] font-bold px-3 py-1.5 transition-colors cursor-pointer"
                    >
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
