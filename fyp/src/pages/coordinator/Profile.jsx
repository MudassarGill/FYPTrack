import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Card from "../../components/shared/Card";
import { getStoredUser } from "../../services/auth";
import { useToast } from "../../components/shared/Toast";
import { getDepartmentSettings, updateDepartmentSettings } from "../../services/api";

export default function CoordinatorProfile() {
  const { addToast } = useToast();
  const user = getStoredUser();

  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    coordinatorName: user?.full_name || "Prof. Dr. Tariq Mahmood",
    designation: "Professor & FYP Programme Coordinator",
    department: "Department of Computer Science & Software Engineering",
    email: user?.email || "coordinator@university.edu",
    officeLocation: "Admin Block, Office Suite A-12",
    contactExt: "+92 51 9260020",
    academicSession: "Spring 2026 - Fall 2026",
    maxGroupSize: 3,
    maxSupervisorQuota: 5,
    similarityThresholdPct: 20,
    allowStudentSelfProposal: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await getDepartmentSettings();
      if (data) {
        setSettings((prev) => ({
          ...prev,
          coordinatorName: user?.full_name || data.coordinator_name || prev.coordinatorName,
          email: user?.email || data.coordinator_email || prev.email,
          academicSession: data.academic_session || prev.academicSession,
          department: data.department_name || prev.department,
          contactExt: data.contact_ext || prev.contactExt,
          officeLocation: data.office_location || prev.officeLocation,
          maxGroupSize: data.max_group_size ?? 3,
          maxSupervisorQuota: data.max_supervisor_quota ?? 5,
          similarityThresholdPct: data.similarity_threshold_pct ?? 20,
          allowStudentSelfProposal: data.allow_student_self_proposal ?? true,
        }));
      }
    } catch (err) {
      console.error("Failed to load department settings:", err);
    }
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateDepartmentSettings({
        max_group_size: settings.maxGroupSize,
        max_supervisor_quota: settings.maxSupervisorQuota,
        similarity_threshold_pct: settings.similarityThresholdPct,
        allow_student_self_proposal: settings.allowStudentSelfProposal,
        coordinator_name: settings.coordinatorName,
        academic_session: settings.academicSession,
        department_name: settings.department,
        contact_ext: settings.contactExt,
        office_location: settings.officeLocation,
      });
      addToast(`Department policy settings updated! Max members per group set to ${settings.maxGroupSize}.`);
      if (user) {
        const updatedUser = { ...user, full_name: settings.coordinatorName };
        localStorage.setItem("fypTrack_auth_user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      addToast(err.message || "Failed to update department settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "TC";
    const cleaned = name.replace(/^(?:Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.|Pro\b|Prof\b|Eng\b|Engr\b)\s*/gi, "").trim();
    const parts = cleaned.split(/\s+/);
    return parts.map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "TC";
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Programme Administration & Profile"
        description="Departmental configuration parameters, committee administration contacts, and institutional FYP policy thresholds."
      />

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coordinator Identification Card (1fr) */}
          <div className="space-y-6">
            <Card className="p-6 text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-[#17302A] text-white font-['Bricolage_Grotesque'] text-[32px] font-extrabold flex items-center justify-center mx-auto shadow-md">
                {getInitials(settings.coordinatorName)}
              </div>

              <div>
                <h2 className="font-['Bricolage_Grotesque'] text-[22px] font-bold text-[#17302A]">
                  {settings.coordinatorName}
                </h2>
                <p className="text-[14px] text-[#5F6B66] font-medium">{settings.designation}</p>
                <p className="text-[12px] text-[#8A948F] mt-0.5">{settings.department}</p>
                <span className="inline-block mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E1F4EA] text-[#0B5A3E]">
                  Committee Head
                </span>
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <h3 className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A]">
                Current Session
              </h3>
              <p className="text-[13px] text-[#5F6B66]">
                Managing academic calendar and grading for:
              </p>
              <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#EEEEEA] font-bold text-[#17302A] text-[14px]">
                {settings.academicSession}
              </div>
            </Card>
          </div>

          {/* Institutional Configuration Controls (2fr) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-5">
              <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] pb-3 border-b border-[#EEEEEA]">
                Office & Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                    Official Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={settings.email}
                    className="w-full rounded-[10px] border border-[#D3D8D4] bg-[#F7F7F6] px-3.5 py-2 text-[14px] text-[#5F6B66] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                    Contact / Intercom Extension
                  </label>
                  <input
                    type="text"
                    value={settings.contactExt}
                    onChange={(e) => setSettings({ ...settings, contactExt: e.target.value })}
                    className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                    Office Location
                  </label>
                  <input
                    type="text"
                    value={settings.officeLocation}
                    onChange={(e) => setSettings({ ...settings, officeLocation: e.target.value })}
                    className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-5">
              <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A] pb-3 border-b border-[#EEEEEA]">
                Department Governance Policy Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                    Maximum Students Per Group
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={settings.maxGroupSize}
                    onChange={(e) => setSettings({ ...settings, maxGroupSize: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                  />
                  <p className="text-[11px] text-[#5F6B66] mt-1">
                    Enforced in student proposal submission form and supervisor dashboards.
                  </p>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                    Default Supervisor Quota Limit (Groups)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.maxSupervisorQuota}
                    onChange={(e) => setSettings({ ...settings, maxSupervisorQuota: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                  />
                  <p className="text-[11px] text-[#5F6B66] mt-1">
                    Maximum capstone groups assigned to each faculty supervisor.
                  </p>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#17302A] mb-1.5">
                    AI Similarity Alert Threshold (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={settings.similarityThresholdPct}
                    onChange={(e) => setSettings({ ...settings, similarityThresholdPct: parseInt(e.target.value) || 5 })}
                    className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
                  />
                  <p className="text-[11px] text-[#5F6B66] mt-1">
                    Proposals exceeding this cosine similarity with archived records are flagged.
                  </p>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2.5 text-[13px] text-[#17302A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowStudentSelfProposal}
                      onChange={(e) => setSettings({ ...settings, allowStudentSelfProposal: e.target.checked })}
                      className="w-4 h-4 text-[#17302A] rounded focus:ring-[#EBB44B]"
                    />
                    <span>Allow students to propose custom project ideas</span>
                  </label>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[14px] px-6 py-2.5 transition-colors shadow-sm cursor-pointer"
              >
                {saving ? "Saving Policy..." : "Save Department Policy Settings"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
