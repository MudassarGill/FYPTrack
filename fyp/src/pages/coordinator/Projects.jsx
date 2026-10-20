import { useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { useToast } from "../../components/shared/Toast";

const masterProjects = [
  {
    id: 1,
    group: "Group 14",
    title: "Crop Price Prediction and Market Advisory System",
    domain: "Machine Learning",
    supervisor: "Dr. Imran Shah",
    members: ["Ayesha Noor", "Hamza Tariq", "Zainab Ali"],
    currentStage: "System Design",
    progress: 70,
    status: "On Track",
    variant: "green",
    defenseEligible: true,
  },
  {
    id: 2,
    group: "Group 08",
    title: "Autonomous Campus Shuttle Navigation",
    domain: "Robotics & Embedded",
    supervisor: "Dr. Rabia Qazi",
    members: ["Bilal Farooq", "Sara Ahmed"],
    currentStage: "Prototype Testing",
    progress: 45,
    status: "Needs Attention",
    variant: "amber",
    defenseEligible: false,
  },
  {
    id: 3,
    group: "Group 21",
    title: "Smart Grid Load Balancer & Anomaly Detection",
    domain: "IoT & Distributed Systems",
    supervisor: "Dr. Asim Javed",
    members: ["Hassan Raza", "Mariam Khan"],
    currentStage: "Mid-Term Evaluation",
    progress: 85,
    status: "On Track",
    variant: "green",
    defenseEligible: true,
  },
  {
    id: 4,
    group: "Group 33",
    title: "Federated Learning for Medical Imaging Privacy",
    domain: "Healthcare AI",
    supervisor: "Dr. Imran Shah",
    members: ["Usman Tariq", "Khadija Bibi"],
    currentStage: "SRS Specification",
    progress: 30,
    status: "Under Review",
    variant: "blue",
    defenseEligible: false,
  },
  {
    id: 5,
    group: "Group 19",
    title: "Real-Time Edge Defect Inspection for Textile Looms",
    domain: "Computer Vision",
    supervisor: "Dr. Rabia Qazi",
    members: ["Fahad Mustafa", "Danish Qureshi"],
    currentStage: "System Design",
    progress: 65,
    status: "On Track",
    variant: "green",
    defenseEligible: true,
  },
  {
    id: 6,
    group: "Group 42",
    title: "Blockchain Powered Degree Verification Protocol",
    domain: "Distributed Ledger",
    supervisor: "Dr. Sadia Malik",
    members: ["Zubair Ahmad", "Saad Malik"],
    currentStage: "Proposal Revision",
    progress: 15,
    status: "Flagged",
    variant: "gray",
    defenseEligible: false,
  },
];

export default function CoordinatorProjects() {
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");

  const filtered = masterProjects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.group.toLowerCase().includes(search.toLowerCase()) ||
      p.supervisor.toLowerCase().includes(search.toLowerCase()) ||
      p.domain.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "All" || p.currentStage === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Department Projects Master Registry"
        description="Complete institutional roster of all 48 capstone projects, supervising faculty, current milestone progress, and defense clearance status."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            48 Active Groups
          </span>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by title, group, supervisor, domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {["All", "Proposal Revision", "SRS Specification", "System Design", "Mid-Term Evaluation", "Prototype Testing"].map((st) => (
              <button
                key={st}
                onClick={() => setStageFilter(st)}
                className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-colors cursor-pointer ${
                  stageFilter === st
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

      {/* Projects Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#FAFAF8] border-b border-[#EEEEEA] text-[12px] uppercase font-semibold text-[#5F6B66]">
              <tr>
                <th className="py-3.5 px-6">Group & Project Title</th>
                <th className="py-3.5 px-4">Domain</th>
                <th className="py-3.5 px-4">Supervisor</th>
                <th className="py-3.5 px-4">Stage & Progress</th>
                <th className="py-3.5 px-4">Defense Clearance</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEA]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#F9F9F8] transition-colors">
                  <td className="py-4 px-6">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#E6E9E6] text-[#17302A] mb-1">
                      {p.group}
                    </span>
                    <div className="font-bold text-[#17302A] line-clamp-1 max-w-[280px]" title={p.title}>
                      {p.title}
                    </div>
                    <div className="text-[12px] text-[#5F6B66]">Team: {p.members.join(", ")}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-[12px] font-medium px-2 py-0.5 rounded bg-[#E1F4EA] text-[#0B5A3E]">
                      {p.domain}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-[#17302A]">{p.supervisor}</div>
                    <div className="text-[11px] text-[#0B5A3E]">Allocated Faculty</div>
                  </td>

                  <td className="py-4 px-4 w-40">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-[#17302A]">{p.currentStage}</span>
                      <span className="text-[#5F6B66]">{p.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#E6E9E6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#17302A] rounded-full"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <Badge variant={p.defenseEligible ? "green" : "amber"} size="sm">
                      {p.defenseEligible ? "Eligible" : "Pending Requirements"}
                    </Badge>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => addToast(`Opening academic audit record for ${p.group}...`, "info")}
                      className="rounded-[8px] bg-[#EEEEEA] hover:bg-[#E0E0DC] text-[#17302A] text-[12px] font-bold px-3 py-1.5 transition-colors cursor-pointer"
                    >
                      Dossier
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
