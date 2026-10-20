import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";

const initialStudents = [
  {
    id: 1,
    name: "Ayesha Noor",
    rollNumber: "FA20-BSE-042",
    program: "BS Software Engineering",
    group: "Group 14",
    projectTitle: "Crop Price Prediction and Market Advisory System",
    currentMilestone: "System Design Document",
    progress: 70,
    status: "On Track",
    variant: "green",
    email: "ayesha.noor@university.edu",
    phone: "+92 301 5551234",
    lastActive: "Today, 11:20 AM",
  },
  {
    id: 2,
    name: "Hamza Tariq",
    rollNumber: "FA20-BSE-058",
    program: "BS Software Engineering",
    group: "Group 14",
    projectTitle: "Crop Price Prediction and Market Advisory System",
    currentMilestone: "System Design Document",
    progress: 70,
    status: "On Track",
    variant: "green",
    email: "hamza.tariq@university.edu",
    phone: "+92 302 5552345",
    lastActive: "Yesterday",
  },
  {
    id: 3,
    name: "Zainab Ali",
    rollNumber: "FA20-BSE-019",
    program: "BS Software Engineering",
    group: "Group 14",
    projectTitle: "Crop Price Prediction and Market Advisory System",
    currentMilestone: "System Design Document",
    progress: 70,
    status: "On Track",
    variant: "green",
    email: "zainab.ali@university.edu",
    phone: "+92 303 5553456",
    lastActive: "2 days ago",
  },
  {
    id: 4,
    name: "Bilal Farooq",
    rollNumber: "FA20-BCS-089",
    program: "BS Computer Science",
    group: "Group 08",
    projectTitle: "Autonomous Campus Shuttle Navigation",
    currentMilestone: "Prototype Sensor Integration",
    progress: 45,
    status: "Needs Attention",
    variant: "amber",
    email: "bilal.farooq@university.edu",
    phone: "+92 304 5554567",
    lastActive: "3 days ago",
  },
  {
    id: 5,
    name: "Sara Ahmed",
    rollNumber: "FA20-BCS-112",
    program: "BS Computer Science",
    group: "Group 08",
    projectTitle: "Autonomous Campus Shuttle Navigation",
    currentMilestone: "Prototype Sensor Integration",
    progress: 45,
    status: "Needs Attention",
    variant: "amber",
    email: "sara.ahmed@university.edu",
    phone: "+92 305 5555678",
    lastActive: "Yesterday",
  },
  {
    id: 6,
    name: "Hassan Raza",
    rollNumber: "FA20-BSE-103",
    program: "BS Software Engineering",
    group: "Group 21",
    projectTitle: "Smart Grid Load Balancer & Anomaly Detection",
    currentMilestone: "Mid-Term Evaluation Prep",
    progress: 85,
    status: "On Track",
    variant: "green",
    email: "hassan.raza@university.edu",
    phone: "+92 306 5556789",
    lastActive: "Today, 9:00 AM",
  },
  {
    id: 7,
    name: "Mariam Khan",
    rollNumber: "FA20-BSE-077",
    program: "BS Software Engineering",
    group: "Group 21",
    projectTitle: "Smart Grid Load Balancer & Anomaly Detection",
    currentMilestone: "Mid-Term Evaluation Prep",
    progress: 85,
    status: "On Track",
    variant: "green",
    email: "mariam.khan@university.edu",
    phone: "+92 307 5557890",
    lastActive: "4 days ago",
  },
  {
    id: 8,
    name: "Usman Tariq",
    rollNumber: "FA20-BCS-034",
    program: "BS Computer Science",
    group: "Group 33",
    projectTitle: "Federated Learning for Medical Imaging Privacy",
    currentMilestone: "Literature Survey & SRS",
    progress: 30,
    status: "Under Review",
    variant: "blue",
    email: "usman.tariq@university.edu",
    phone: "+92 308 5558901",
    lastActive: "Yesterday",
  },
];

export default function MyStudents() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filtered = initialStudents.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.group.toLowerCase().includes(search.toLowerCase()) ||
      s.projectTitle.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterStatus === "All" ? true : s.status.toLowerCase() === filterStatus.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="My Students"
        description="Comprehensive roster of students assigned to your supervision for FYP 2026."
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
              {filtered.length} Students Listed
            </span>
          </div>
        }
      />

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by name, roll # or group..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {["All", "On Track", "Needs Attention", "Under Review"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-semibold transition-colors cursor-pointer ${
                  filterStatus === st
                    ? "bg-[#17302A] text-white"
                    : "bg-[#EEEEEA] text-[#5F6B66] hover:bg-[#E0E0DC]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Students Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#FAFAF8] border-b border-[#EEEEEA] text-[12px] uppercase font-semibold text-[#5F6B66]">
              <tr>
                <th className="py-3.5 px-6">Student Info</th>
                <th className="py-3.5 px-4">Group & Project</th>
                <th className="py-3.5 px-4">Current Milestone</th>
                <th className="py-3.5 px-4">Progress</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEA]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#F9F9F8] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E1F4EA] text-[#0B5A3E] font-bold text-[13px] flex items-center justify-center shrink-0">
                        {s.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="font-bold text-[#17302A]">{s.name}</div>
                        <div className="text-[12px] text-[#5F6B66]">{s.rollNumber}</div>
                        <div className="text-[11px] text-[#8A948F]">{s.program}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#E6E9E6] text-[#17302A] mb-1">
                      {s.group}
                    </span>
                    <div className="font-medium text-[#17302A] line-clamp-1 max-w-[240px]" title={s.projectTitle}>
                      {s.projectTitle}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-[#17302A]">{s.currentMilestone}</div>
                    <div className="text-[12px] text-[#5F6B66]">Active Phase</div>
                  </td>

                  <td className="py-4 px-4 w-36">
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="font-semibold text-[#17302A]">{s.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#E6E9E6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#17302A] rounded-full"
                        style={{ width: `${s.progress}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <Badge variant={s.variant} size="sm">
                      {s.status}
                    </Badge>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="rounded-[8px] bg-[#EEEEEA] hover:bg-[#E0E0DC] text-[#17302A] text-[12px] font-bold px-3 py-1.5 transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                      <Link
                        to="/supervisor/feedback"
                        className="rounded-[8px] bg-[#17302A] hover:bg-[#24493F] text-white text-[12px] font-bold px-3 py-1.5 transition-colors"
                      >
                        Feedback
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-lg w-full shadow-2xl space-y-4 border border-[#E6E6E1]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B5A3E] bg-[#E1F4EA] px-2.5 py-0.5 rounded-full">
                  {selectedStudent.group}
                </span>
                <h3 className="font-['Bricolage_Grotesque'] text-[22px] font-bold text-[#17302A] mt-1">
                  {selectedStudent.name}
                </h3>
                <p className="text-[13px] text-[#5F6B66]">{selectedStudent.rollNumber} • {selectedStudent.program}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-[#5F6B66] hover:text-[#17302A] text-[20px] font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#EEEEEA] space-y-2 text-[13px]">
              <div>
                <span className="font-semibold text-[#17302A]">Project: </span>
                <span className="text-[#5F6B66]">{selectedStudent.projectTitle}</span>
              </div>
              <div>
                <span className="font-semibold text-[#17302A]">Current Milestone: </span>
                <span className="text-[#5F6B66]">{selectedStudent.currentMilestone}</span>
              </div>
              <div>
                <span className="font-semibold text-[#17302A]">Email: </span>
                <a href={`mailto:${selectedStudent.email}`} className="text-[#2563EB] hover:underline">
                  {selectedStudent.email}
                </a>
              </div>
              <div>
                <span className="font-semibold text-[#17302A]">Phone: </span>
                <span className="text-[#5F6B66]">{selectedStudent.phone}</span>
              </div>
              <div>
                <span className="font-semibold text-[#17302A]">Last Active: </span>
                <span className="text-[#5F6B66]">{selectedStudent.lastActive}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-[10px] border border-[#D3D8D4] text-[13px] font-bold text-[#5F6B66] hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
              <Link
                to="/supervisor/documents"
                className="px-4 py-2 rounded-[10px] bg-[#17302A] hover:bg-[#24493F] text-white text-[13px] font-bold transition-colors"
              >
                View Documents
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
