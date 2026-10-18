import { useState } from "react";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import PageHeader from "../../components/shared/PageHeader";
import { documents as initialDocs, milestones } from "../../data/mock";

export default function Documents() {
  const [docList, setDocList] = useState(initialDocs);
  const [filter, setFilter] = useState("all"); // "all" | "approved" | "pending"
  const [selectedMilestone, setSelectedMilestone] = useState("Prototype Demo");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const filteredDocs = docList.filter((doc) => {
    if (filter === "all") return true;
    return doc.status === filter;
  });

  function handleUpload(e) {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setTimeout(() => {
      const newDoc = {
        id: docList.length + 1,
        name: selectedFile.name,
        uploaded_at: new Date().toISOString().split("T")[0],
        status: "pending",
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        milestone: selectedMilestone,
      };
      setDocList([newDoc, ...docList]);
      setSelectedFile(null);
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    }, 800);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Document Repository & Deliverables"
        description="Upload IEEE-compliant milestone reports, architecture blueprints, and defense slide decks."
      />

      {/* Upload Deliverable Card */}
      <Card className="p-6 sm:p-8 border-2 border-dashed border-[#D3D8D4] hover:border-[#17302A] transition-colors">
        <h3 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#17302A] mb-1">
          Upload New Deliverable
        </h3>
        <p className="text-xs text-[#5F6B66] mb-6">
          Accepted formats: PDF, DOCX, ZIP (Max 25 MB). Submissions are time-stamped and sent to your supervisor.
        </p>

        {uploadSuccess && (
          <div className="p-4 rounded-xl bg-[#E1F4EA] text-[#0B5A3E] text-xs font-semibold mb-6">
            Document submitted successfully and queued for supervisor review!
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17302A] mb-2">
                Target Milestone
              </label>
              <select
                value={selectedMilestone}
                onChange={(e) => setSelectedMilestone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D3D8D4] focus:outline-none focus:border-[#17302A] text-xs font-medium bg-white"
              >
                {milestones.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.due_date})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17302A] mb-2">
                Select File
              </label>
              <input
                type="file"
                required
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full px-4 py-2 rounded-xl border border-[#D3D8D4] text-xs text-[#5F6B66] file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#17302A] file:text-white hover:file:bg-[#24493F]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2.5 rounded-xl bg-[#EBB44B] hover:bg-[#DDA53A] disabled:opacity-50 text-[#17302A] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </Card>

      {/* Filter Tabs & Documents List */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E6E1]">
          <h3 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#17302A]">
            Submitted Deliverables ({filteredDocs.length})
          </h3>

          <div className="flex gap-2">
            {["all", "approved", "pending"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  filter === tab
                    ? "bg-[#17302A] text-white"
                    : "bg-[#ECECE8] text-[#5F6B66] hover:text-[#17302A]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6E6E1] text-[#5F6B66] uppercase tracking-wider font-bold">
                <th className="py-3 px-2">Document Name</th>
                <th className="py-3 px-2">Milestone</th>
                <th className="py-3 px-2">Date Uploaded</th>
                <th className="py-3 px-2">Size</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E6E1]">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#F4F4F2] transition-colors">
                  <td className="py-3.5 px-2 font-bold text-[#17302A]">
                    {doc.name}
                  </td>
                  <td className="py-3.5 px-2 text-[#5F6B66] font-medium">
                    {doc.milestone}
                  </td>
                  <td className="py-3.5 px-2 text-[#5F6B66]">
                    {doc.uploaded_at}
                  </td>
                  <td className="py-3.5 px-2 text-[#5F6B66]">
                    {doc.size}
                  </td>
                  <td className="py-3.5 px-2">
                    <Badge variant={doc.status}>
                      {doc.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Downloading ${doc.name}...`)}
                      className="text-xs font-bold text-[#17302A] hover:text-[#F59E0B] transition-colors"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
