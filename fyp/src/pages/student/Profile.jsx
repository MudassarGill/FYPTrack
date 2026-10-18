import { useState } from "react";
import Card from "../../components/shared/Card";
import PageHeader from "../../components/shared/PageHeader";
import { currentStudent, supervisor, coordinator } from "../../data/mock";
import { getStoredUser } from "../../services/auth";

export default function Profile() {
  const user = getStoredUser() || currentStudent;
  const [fullName, setFullName] = useState(user.full_name || currentStudent.full_name);
  const [email] = useState(user.email || currentStudent.email);
  const [githubUrl, setGithubUrl] = useState("https://github.com/ali-khan/crop-price-prediction");
  const [phone, setPhone] = useState("+92 300 1234567");
  const [savedSuccess, setSavedSuccess] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Student Academic Profile"
        description="Verify enrolled university credentials, project group assignments, and contact channels."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary Card */}
        <div className="space-y-6">
          <Card className="p-6 text-center">
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center font-['Bricolage_Grotesque'] text-2xl font-bold text-[#17302A] shadow-md border-4 border-white"
              style={{ backgroundColor: currentStudent.avatar_color }}
            >
              {currentStudent.initials}
            </div>

            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#17302A] mt-4">
              {fullName}
            </h3>
            <p className="text-xs text-[#5F6B66] font-semibold mt-0.5">
              Roll No: {currentStudent.roll_number}
            </p>
            <p className="text-xs text-[#5F6B66] mt-0.5">{email}</p>

            <div className="mt-6 pt-6 border-t border-[#E6E6E1] text-left space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5F6B66]">Academic Program</span>
                <span className="font-bold text-[#17302A]">BS Software Eng.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6B66]">Current Semester</span>
                <span className="font-bold text-[#17302A]">8th Semester</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6B66]">Project Group</span>
                <span className="font-bold text-[#17302A]">Group 14 (Lead)</span>
              </div>
            </div>
          </Card>

          {/* Academic Committee Card */}
          <Card className="p-6">
            <h4 className="font-['Bricolage_Grotesque'] text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-3">
              Assigned Supervision
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <p className="font-bold text-[#17302A]">{supervisor.full_name}</p>
                <p className="text-[#5F6B66]">Supervisor • {supervisor.department}</p>
              </div>
              <div className="pt-2 border-t border-[#E6E6E1]">
                <p className="font-bold text-[#17302A]">{coordinator.full_name}</p>
                <p className="text-[#5F6B66]">FYP Coordinator • {coordinator.department}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Editable Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8">
            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#17302A] mb-1">
              Contact & Repository Details
            </h3>
            <p className="text-xs text-[#5F6B66] mb-6">
              Keep your contact channels and code repository links up to date for review committee access.
            </p>

            {savedSuccess && (
              <div className="p-4 rounded-xl bg-[#E1F4EA] text-[#0B5A3E] text-xs font-semibold mb-6">
                Profile preferences updated successfully!
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#17302A] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D3D8D4] text-xs font-medium focus:outline-none focus:border-[#17302A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#17302A] mb-2">
                    University Email (Immutable)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D3D8D4] text-xs font-medium bg-[#ECECE8] text-[#5F6B66] cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#17302A] mb-2">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D3D8D4] text-xs font-medium focus:outline-none focus:border-[#17302A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#17302A] mb-2">
                    Project GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D3D8D4] text-xs font-medium focus:outline-none focus:border-[#17302A]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </Card>

          {/* Account Security Card */}
          <Card className="p-6 sm:p-8">
            <h3 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#17302A] mb-2">
              Authentication & Session
            </h3>
            <p className="text-xs text-[#5F6B66] mb-4">
              Your session is secured via university JWT authentication. If you suspect unauthorized access, reset your password or sign out.
            </p>
            <div className="flex gap-4">
              <a
                href="/login"
                className="px-4 py-2 rounded-lg border border-[#D3D8D4] text-xs font-semibold text-[#17302A] hover:bg-[#F4F4F2]"
              >
                Switch Account
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
