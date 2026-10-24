import { useState, useEffect } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import Card from "../../components/shared/Card";
import { getAllStudents } from "../../services/api";

export default function CoordinatorStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("All");

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      setLoading(true);
      const data = await getAllStudents();
      setStudents(data || []);
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = students.filter((s) => {
    const matchSearch =
      (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.roll || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.group || "").toLowerCase().includes(search.toLowerCase());
    const matchProgram = programFilter === "All" || s.program === programFilter;
    return matchSearch && matchProgram;
  });

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Department Student Registry"
        description="Official academic registry for final year students. Verify prerequisite credit hours, CGPA standing, and defense eligibility."
        action={
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17302A] text-white">
            {students.length} Registered Candidates
          </span>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by student name, roll # or group..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[10px] border border-[#D3D8D4] bg-white px-3.5 py-2 text-[14px] outline-none focus:border-[#EBB44B] focus:ring-2 focus:ring-[#FEF3D6]"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {["All", "BS Software Engineering", "BS Computer Science"].map((prog) => (
              <button
                key={prog}
                onClick={() => setProgramFilter(prog)}
                className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-semibold transition-colors cursor-pointer ${
                  programFilter === prog
                    ? "bg-[#17302A] text-white"
                    : "bg-[#EEEEEA] text-[#5F6B66] hover:bg-[#E0E0DC]"
                }`}
              >
                {prog}
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
                <th className="py-3.5 px-6">Student Information</th>
                <th className="py-3.5 px-4">Degree Programme</th>
                <th className="py-3.5 px-4">Assigned Group</th>
                <th className="py-3.5 px-4">Credits Completed</th>
                <th className="py-3.5 px-4">CGPA</th>
                <th className="py-3.5 px-6 text-right">Defense Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEA]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#F9F9F8] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#E1F4EA] text-[#0B5A3E] font-bold text-[12px] flex items-center justify-center shrink-0">
                        {s.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-bold text-[#17302A]">{s.name}</div>
                        <div className="text-[12px] text-[#5F6B66]">{s.roll}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-medium text-[#17302A]">{s.program}</td>

                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#E6E9E6] text-[#17302A]">
                      {s.group}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-[#5F6B66] font-medium">{s.credits}</td>

                  <td className="py-4 px-4 font-bold text-[#17302A]">{s.cgpa}</td>

                  <td className="py-4 px-6 text-right">
                    <Badge variant={s.eligible ? "green" : "amber"} size="sm">
                      {s.eligible ? "Eligible" : "Pending Credits"}
                    </Badge>
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
