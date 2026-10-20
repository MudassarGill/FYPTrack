import { useState } from "react";
import { useToast } from "../../components/shared/Toast";

const initialFiles = [
  {
    name: "SRS_Crop_Prediction_v1.pdf",
    deliverable: "Software Requirements Specification",
    date: "28 Oct 2026",
    size: "4.1 MB",
    status: "Approved",
    variant: "green",
    uploaded: true,
  },
  {
    name: "Proposal_Document_Final.pdf",
    deliverable: "Project Proposal Defense",
    date: "15 Oct 2026",
    size: "2.4 MB",
    status: "Approved",
    variant: "green",
    uploaded: true,
  },
  {
    name: "System_Architecture_Design.pdf",
    deliverable: "System Design Document",
    date: "Due 12 Nov 2026",
    size: "-",
    status: "Pending Upload",
    variant: "amber",
    uploaded: false,
  },
  {
    name: "Prototype_Testing_Report.docx",
    deliverable: "Prototype Demo & Test Plan",
    date: "Due 05 Dec 2026",
    size: "-",
    status: "Upcoming",
    variant: "gray",
    uploaded: false,
  },
];

export default function Documents() {
  const { addToast } = useToast();
  const [files, setFiles] = useState(initialFiles);

  const handleUploadClick = () => {
    addToast("Please select a file to upload from the file dialog.", "info");
  };

  const handleDownload = (fileName) => {
    addToast(`Downloading ${fileName}...`, "info");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header = H1 30px Bricolage + muted subtitle + "Upload New" amber button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Bricolage_Grotesque'] text-[30px] font-bold text-[#17302A] leading-tight">
            Project Documents
          </h1>
          <p className="text-[14px] text-[#5F6B66] mt-1">
            Official milestone deliverables, similarity audit reports, and evaluation submissions.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={handleUploadClick}
            className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors cursor-pointer shadow-sm"
          >
            Upload New
          </button>
        </div>
      </div>

      {/* Dashed-border drop area ("Drag and drop files here", "PDF or DOCX, up to 20 MB", outline "Browse files") */}
      <div className="border-2 border-dashed border-[#D3D8D4] rounded-[16px] p-8 text-center bg-white hover:bg-[#F8F9F8] transition-colors">
        <div className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A] mb-1">
          Drag and drop files here
        </div>
        <p className="text-[13px] text-[#5F6B66] mb-4">
          PDF or DOCX, up to 20 MB
        </p>
        <label className="inline-block rounded-[10px] border-[1.5px] border-[#17302A] text-[#17302A] hover:bg-[#17302A] hover:text-white font-bold text-[14px] px-[18px] py-[9px] cursor-pointer transition-colors">
          Browse files
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                const newFile = {
                  name: e.target.files[0].name,
                  deliverable: "System Design Document",
                  date: "Uploaded just now",
                  size: "3.2 MB",
                  status: "Under Review",
                  variant: "amber",
                  uploaded: true,
                };
                setFiles([newFile, ...files.filter((f) => f.name !== newFile.name)]);
                addToast(`File ${newFile.name} attached and submitted successfully!`);
              }
            }}
          />
        </label>
      </div>

      {/* Card: Submitted Files */}
      <div className="card-base">
        <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-4">
          Submitted Files
        </h3>
        <div className="space-y-3">
          {files.map((f) => {
            let badgeClass = "bg-[#ECECE8] text-[#4A5651]";
            if (f.variant === "green") badgeClass = "bg-[#E1F4EA] text-[#0B5A3E]";
            if (f.variant === "amber") badgeClass = "bg-[#FEF3D6] text-[#6B4700]";
            return (
              <div
                key={f.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 border-b border-[#EEEEEA] last:border-0"
              >
                <div>
                  <div className="font-semibold text-[15px] text-[#17302A]">{f.name}</div>
                  <div className="text-[12px] text-[#5F6B66]">
                    {f.deliverable} &bull; {f.date} {f.size !== "-" ? `\u2022 ${f.size}` : ""}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${badgeClass}`}>
                    {f.status}
                  </span>
                  {f.uploaded ? (
                    <button
                      type="button"
                      onClick={() => handleDownload(f.name)}
                      className="rounded-[10px] border-[1.5px] border-[#17302A] text-[#17302A] hover:bg-[#17302A] hover:text-white font-bold text-[13px] px-[14px] py-[6px] transition-colors cursor-pointer"
                    >
                      Download
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[13px] px-[14px] py-[6px] transition-colors cursor-pointer"
                    >
                      Upload
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
