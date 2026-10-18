import { useState } from "react";
import { getStoredUser } from "../../services/auth";

export default function Profile() {
  const user = getStoredUser();
  const student = user?.student || {};

  const fullName = user?.full_name || "Ayesha Noor";
  const email = user?.email || "ayesha.noor@university.edu";
  const rollNo = student.roll_number || user?.roll_number || "FA20-BSE-042";
  const program = student.program || "BS Software Engineering";
  const group = student.group_name || "Group 14 (Lead)";

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    alert("Password updated successfully!");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-8 pb-12">
      {/* Header = H1 30px Bricolage + muted subtitle */}
      <div>
        <h1 className="font-['Bricolage_Grotesque'] text-[30px] font-bold text-[#17302A] leading-tight">
          Student Profile
        </h1>
        <p className="text-[14px] text-[#5F6B66] mt-1">
          Review verified academic credentials and manage your account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Read-only student info (incl. roll number, program, group) */}
        <div className="card-base flex flex-col justify-between">
          <div>
            <div className="text-center pb-6 border-b border-[#EEEEEA]">
              <div className="w-[68px] h-[68px] rounded-full bg-[#EBB44B] text-[#17302A] font-['Bricolage_Grotesque'] text-[24px] font-bold flex items-center justify-center mx-auto mb-3 shadow-md">
                {initials}
              </div>
              <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
                {fullName}
              </h3>
              <p className="text-[13px] text-[#5F6B66]">{email}</p>
            </div>

            <div className="pt-5 space-y-3.5 text-[14px]">
              <div>
                <span className="text-[12px] font-semibold text-[#5F6B66] block">
                  Roll Number
                </span>
                <span className="font-bold text-[#17302A]">{rollNo}</span>
              </div>

              <div>
                <span className="text-[12px] font-semibold text-[#5F6B66] block">
                  Academic Program
                </span>
                <span className="font-bold text-[#17302A]">{program}</span>
              </div>

              <div>
                <span className="text-[12px] font-semibold text-[#5F6B66] block">
                  Assigned Project Group
                </span>
                <span className="font-bold text-[#17302A]">{group}</span>
              </div>

              <div>
                <span className="text-[12px] font-semibold text-[#5F6B66] block">
                  Department
                </span>
                <span className="font-bold text-[#17302A]">Computer Science</span>
              </div>

              <div>
                <span className="text-[12px] font-semibold text-[#5F6B66] block">
                  Account Status
                </span>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#E1F4EA] text-[#0B5A3E]">
                  Active Student
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EEEEEA] mt-6 text-[12px] text-[#5F6B66]">
            Credentials verified via university registrar
          </div>
        </div>

        {/* Right 2 Columns: Change Password Form */}
        <div className="lg:col-span-2 card-static">
          <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] mb-1">
            Change Password
          </h3>
          <p className="text-[14px] text-[#5F6B66] mb-6">
            Update your portal login password. Use at least 8 characters with a mix of letters and numbers.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3 py-[11px] text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-[18px] py-[11px] transition-colors cursor-pointer shadow-sm"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
