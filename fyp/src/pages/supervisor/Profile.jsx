import { useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Card from "../../components/shared/Card";
import { getStoredUser } from "../../services/auth";

export default function SupervisorProfile() {
  const user = getStoredUser();

  const [profile, setProfile] = useState({
    fullName: user?.full_name || "Dr. Imran Shah",
    designation: "Associate Professor",
    department: "Department of Computer Science",
    facultyId: "FAC-CS-1042",
    email: user?.email || "imran.shah@university.edu",
    phone: "+92 51 9260001",
    officeRoom: "Block C, Faculty Suite 304",
    officeHours: "Monday & Wednesday, 11:00 AM – 01:00 PM",
    maxCapacity: 5,
    currentAllocated: 4,
    acceptingNewGroups: true,
    expertise: [
      "Machine Learning & Deep Neural Networks",
      "Vector Embeddings & NLP",
      "Time-Series Forecasting",
      "Edge Computing & Distributed IoT",
      "Data Analytics & Decision Systems",
    ],
  });

  const [newTag, setNewTag] = useState("");

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !profile.expertise.includes(newTag.trim())) {
      setProfile({
        ...profile,
        expertise: [...profile.expertise, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setProfile({
      ...profile,
      expertise: profile.expertise.filter((t) => t !== tagToRemove),
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Profile and supervision parameters updated successfully!");
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Supervisor Profile"
        description="Manage your academic credentials, office hours, supervision quota, and research domain tags used for AI recommendations."
      />

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Workload Status (1fr) */}
          <div className="space-y-6">
            <Card className="p-6 text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-[#EBB44B] text-[#17302A] font-['Bricolage_Grotesque'] text-[32px] font-extrabold flex items-center justify-center mx-auto shadow-md">
                {profile.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <div>
                <h2 className="font-['Bricolage_Grotesque'] text-[22px] font-bold text-[#17302A]">
                  {profile.fullName}
                </h2>
                <p className="text-[14px] text-[#5F6B66] font-medium">{profile.designation}</p>
                <p className="text-[12px] text-[#8A948F] mt-0.5">{profile.department}</p>
                <span className="inline-block mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEEEEA] text-[#17302A]">
                  {profile.facultyId}
                </span>
              </div>
            </Card>

            {/* Workload Capacity Card */}
            <Card className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A]">
                  Supervision Load
                </h3>
                <span className="text-[12px] font-bold text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-0.5 rounded-full">
                  {profile.currentAllocated} / {profile.maxCapacity} Groups
                </span>
              </div>

              <p className="text-[13px] text-[#5F6B66]">
                You have <strong>{profile.maxCapacity - profile.currentAllocated} free slot</strong> remaining for the 2026 academic cycle.
              </p>

              <div className="h-2.5 w-full bg-[#E6E9E6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#17302A] rounded-full"
                  style={{
                    width: `${(profile.currentAllocated / profile.maxCapacity) * 100}%`,
                  }}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 text-[13px] text-[#17302A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.acceptingNewGroups}
                    onChange={(e) =>
                      setProfile({ ...profile, acceptingNewGroups: e.target.checked })
                    }
                    className="w-4 h-4 text-[#17302A] rounded focus:ring-[#EBB44B]"
                  />
                  <span>Accept AI-recommended proposal matches</span>
                </label>
              </div>
            </Card>
          </div>

          {/* Right Column: Detailed Editable Information (2fr) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-5">
              <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] pb-3 border-b border-[#EEEEEA]">
                Contact & Office Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full rounded-[10px] border border-[#D3D8D4] bg-[#FAFAF8] px-3.5 py-2 text-[14px] text-[#5F6B66] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                    Phone / Extension
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                    Office Location
                  </label>
                  <input
                    type="text"
                    value={profile.officeRoom}
                    onChange={(e) => setProfile({ ...profile, officeRoom: e.target.value })}
                    className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                    Student Consultation Hours
                  </label>
                  <input
                    type="text"
                    value={profile.officeHours}
                    onChange={(e) => setProfile({ ...profile, officeHours: e.target.value })}
                    className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                  />
                </div>
              </div>
            </Card>

            {/* Research Domains & AI Embedding Profiles */}
            <Card className="p-6 space-y-4">
              <div>
                <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-1">
                  Research Expertise & AI Vector Keywords
                </h3>
                <p className="text-[13px] text-[#5F6B66]">
                  These keywords are converted into dense vector embeddings for the AI supervisor-proposal recommendation engine.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {profile.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold bg-[#E1F4EA] text-[#0B5A3E] border border-[#C5E8D6]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-[#0B5A3E] hover:text-red-600 font-bold ml-1 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add new research domain or topic..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="rounded-[10px] bg-[#EEEEEA] hover:bg-[#E0E0DC] text-[#17302A] font-bold text-[13px] px-4 py-2 transition-colors cursor-pointer"
                >
                  + Add Tag
                </button>
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-6 py-2.5 transition-colors shadow-sm cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
