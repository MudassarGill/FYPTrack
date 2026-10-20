import { useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";

const initialFaculty = [
  {
    id: 1,
    name: "Dr. Imran Shah",
    designation: "Associate Professor",
    domain: "Machine Learning, NLP & Time-Series",
    capacity: 5,
    assignedGroups: ["Group 14 (Crop Price)", "Group 33 (Federated Medical)", "Group 02 (NLP Translation)", "Group 11 (Vision Defect)"],
    freeSlots: 1,
    status: "Available",
    matchScore: "94.2% AI Fit",
  },
  {
    id: 2,
    name: "Dr. Noman Ali",
    designation: "Professor",
    domain: "Distributed Systems & Cloud Computing",
    capacity: 5,
    assignedGroups: ["Group 05 (Cloud Ops)", "Group 09 (Microservices)", "Group 15 (DB Replication)", "Group 22 (Kafka Pipeline)", "Group 31 (Serverless)"],
    freeSlots: 0,
    status: "Quota Full",
    matchScore: "81.0% AI Fit",
  },
  {
    id: 3,
    name: "Dr. Rabia Qazi",
    designation: "Assistant Professor",
    domain: "Computer Vision & Edge Devices",
    capacity: 5,
    assignedGroups: ["Group 08 (Autonomous Shuttle)", "Group 19 (Loom Defect)", "Group 26 (Traffic Flow)"],
    freeSlots: 2,
    status: "Available",
    matchScore: "91.8% AI Fit",
  },
  {
    id: 4,
    name: "Dr. Sadia Malik",
    designation: "Associate Professor",
    domain: "Cybersecurity & Blockchain",
    capacity: 4,
    assignedGroups: ["Group 03 (Zero-Trust)", "Group 18 (Malware Sandboxing)", "Group 27 (Smart Contracts)", "Group 42 (Degree Verification)"],
    freeSlots: 0,
    status: "Quota Full",
    matchScore: "78.4% AI Fit",
  },
  {
    id: 5,
    name: "Dr. Asim Javed",
    designation: "Assistant Professor",
    domain: "IoT, Sensors & Embedded Robotics",
    capacity: 4,
    assignedGroups: ["Group 21 (Smart Grid)", "Group 35 (Drone Telemetry)"],
    freeSlots: 2,
    status: "Available",
    matchScore: "88.5% AI Fit",
  },
];

const unassignedGroups = [
  {
    group: "Group 47",
    title: "Autonomous Drone Precision Agriculture Mapping",
    domain: "Robotics & Computer Vision",
    bestMatch: "Dr. Rabia Qazi (92.4% Topic Similarity via all-MiniLM-L6-v2)",
    status: "Awaiting Allocation",
  },
  {
    group: "Group 50",
    title: "Urdu Dialect Conversational Speech-to-Text Pipeline",
    domain: "Speech AI & NLP",
    bestMatch: "Dr. Imran Shah (95.1% Topic Similarity via all-MiniLM-L6-v2)",
    status: "Awaiting Allocation",
  },
];

export default function SupervisorAllocation() {
  const [faculty, setFaculty] = useState(initialFaculty);
  const [pendingGroups, setPendingGroups] = useState(unassignedGroups);

  const handleAutoAssign = (groupName, facultyName) => {
    alert(`AI Recommendation Accepted! ${groupName} allocated to ${facultyName}.`);
    setPendingGroups(pendingGroups.filter((g) => g.group !== groupName));
  };

  const handleRunAiOptimizer = () => {
    alert("Running open-source vector embedding optimization (all-MiniLM-L6-v2). Balances topic overlap against faculty capacity limits.");
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="AI Supervisor Allocation & Workload Balancer"
        description="Pair student project proposals with departmental supervisors based on open-source vector similarity embeddings and current supervision quotas."
        action={
          <button
            type="button"
            onClick={handleRunAiOptimizer}
            className="rounded-[10px] bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-[13px] px-4 py-2 transition-colors shadow-sm cursor-pointer"
          >
            ⚡ Run AI Workload Optimizer
          </button>
        }
      />

      {/* Unassigned Proposals Queue */}
      {pendingGroups.length > 0 && (
        <Card className="p-6 border-l-4 border-l-[#EBB44B] bg-[#FFFDF8]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-bold text-[#17302A]">
              Proposals Requiring Supervisor Assignment ({pendingGroups.length})
            </h3>
            <span className="text-[12px] font-bold text-[#6B4700] bg-[#FEF3D6] px-2.5 py-0.5 rounded-full">
              AI Suggestions Ready
            </span>
          </div>

          <div className="space-y-3">
            {pendingGroups.map((pg) => (
              <div
                key={pg.group}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border border-[#EEEEEA] bg-white"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-bold px-2 py-0.5 rounded bg-[#17302A] text-white">
                      {pg.group}
                    </span>
                    <span className="text-[12px] font-medium text-[#5F6B66]">{pg.domain}</span>
                  </div>
                  <div className="font-bold text-[15px] text-[#17302A]">{pg.title}</div>
                  <div className="text-[12px] text-[#0B5A3E] font-semibold mt-1">
                    Suggested Match: {pg.bestMatch}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleAutoAssign(pg.group, pg.bestMatch.split(" (")[0])}
                    className="rounded-[8px] bg-[#17302A] hover:bg-[#24493F] text-white text-[12px] font-bold px-4 py-2 transition-colors cursor-pointer"
                  >
                    Confirm Assignment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Faculty Quotas & Roster */}
      <div className="space-y-4">
        <h3 className="font-['Bricolage_Grotesque'] text-[22px] font-bold text-[#17302A]">
          Department Faculty Supervision Quotas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map((f) => {
            const pct = (f.assignedGroups.length / f.capacity) * 100;
            const isFull = f.freeSlots === 0;
            return (
              <Card key={f.id} className="p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-['Bricolage_Grotesque'] text-[18px] font-bold text-[#17302A]">
                        {f.name}
                      </h4>
                      <p className="text-[12px] text-[#5F6B66]">{f.designation}</p>
                    </div>
                    <Badge variant={isFull ? "gray" : "green"} size="sm">
                      {f.status}
                    </Badge>
                  </div>

                  <p className="text-[12px] text-[#5F6B66] mb-3 line-clamp-2">
                    <strong className="text-[#17302A]">Research: </strong>
                    {f.domain}
                  </p>

                  {/* Quota Progress */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#5F6B66]">Supervision Quota:</span>
                      <span className="font-bold text-[#17302A]">
                        {f.assignedGroups.length} / {f.capacity} Groups
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#E6E9E6] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isFull ? "bg-red-600" : "bg-[#17302A]"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Assigned Groups Pills */}
                  <div className="space-y-1.5 pt-2 border-t border-[#EEEEEA]">
                    <span className="text-[11px] uppercase font-bold text-[#8A948F]">
                      Allocated Projects:
                    </span>
                    <div className="space-y-1 text-[12px] text-[#17302A]">
                      {f.assignedGroups.map((grp) => (
                        <div key={grp} className="truncate">
                          • {grp}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EEEEEA] flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-[#0B5A3E]">{f.freeSlots} Slot Available</span>
                  <button
                    type="button"
                    onClick={() => alert(`Opening allocation manager for ${f.name}`)}
                    className="text-[12px] font-bold text-[#17302A] hover:text-[#C2410C] cursor-pointer"
                  >
                    Adjust Quota &rarr;
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
