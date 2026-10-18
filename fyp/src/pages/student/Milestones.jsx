import { Link } from "react-router-dom";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import ProgressBar from "../../components/shared/ProgressBar";
import StatCard from "../../components/shared/StatCard";
import PageHeader from "../../components/shared/PageHeader";
import { milestones } from "../../data/mock";

export default function Milestones() {
  const completed = milestones.filter((m) => m.status === "completed").length;
  const totalEarnedMarks = milestones
    .filter((m) => m.marks !== undefined)
    .reduce((acc, m) => acc + m.marks, 0);
  const totalPossibleEvaluated = milestones
    .filter((m) => m.marks !== undefined)
    .reduce((acc, m) => acc + (m.total_marks || 0), 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Project Milestones & Deadlines"
        description="Comprehensive breakdown of deliverables, evaluation rubrics, deadline calendars, and supervisor grading."
        action={
          <Link
            to="/student/documents"
            className="px-4 py-2.5 rounded-xl bg-[#17302A] hover:bg-[#24493F] text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Submit Deliverables
          </Link>
        }
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Milestones Completed"
          value={`${completed} / ${milestones.length}`}
          subtext="On-schedule milestone progression"
        />
        <StatCard
          label="Accumulated Marks"
          value={`${totalEarnedMarks} / ${totalPossibleEvaluated}`}
          subtext="Based on 3 graded milestones to date"
          highlight={true}
        />
        <StatCard
          label="Current Sprint"
          value="Prototype Demo"
          subtext="Due Dec 01, 2026 (14 days remaining)"
        />
      </div>

      {/* Milestones List */}
      <div className="space-y-6">
        {milestones.map((milestone, idx) => {
          const isCompleted = milestone.status === "completed";
          const isInProgress = milestone.status === "in_progress";

          return (
            <Card
              key={milestone.id}
              className={`p-6 sm:p-7 ${
                isInProgress
                  ? "border-2 border-[#EBB44B] bg-[#FFFDF8]"
                  : "bg-white"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E6E6E1]">
                <div className="flex items-start gap-4">
                  <span
                    className={`w-10 h-10 rounded-xl font-['Bricolage_Grotesque'] text-base font-bold flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? "bg-[#E1F4EA] text-[#0B5A3E]"
                        : isInProgress
                        ? "bg-[#FEF3D6] text-[#6B4700]"
                        : "bg-[#ECECE8] text-[#5F6B66]"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#17302A]">
                      {milestone.name}
                    </h3>
                    <p className="text-xs text-[#5F6B66] mt-0.5">
                      Deadline: <span className="font-semibold text-[#17302A]">{milestone.due_date}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  {milestone.marks !== undefined && (
                    <span className="font-['Bricolage_Grotesque'] text-lg font-extrabold text-[#17302A]">
                      {milestone.marks} / {milestone.total_marks}
                    </span>
                  )}
                  <Badge variant={milestone.status}>
                    {milestone.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="py-4">
                <ProgressBar
                  value={milestone.progress}
                  label="Milestone Progress"
                  color={isInProgress ? "amber" : "ink"}
                  height="h-2"
                />
              </div>

              {/* Supervisor Evaluation Comment */}
              {milestone.evaluation_comment && (
                <div className="mt-2 p-3.5 rounded-xl bg-[#F4F4F2] border border-[#E6E6E1]/70 text-xs">
                  <span className="font-bold text-[#17302A] uppercase tracking-wider text-[10px] block mb-1">
                    Supervisor Evaluation Notes
                  </span>
                  <p className="text-[#5F6B66] leading-relaxed">
                    "{milestone.evaluation_comment}"
                  </p>
                </div>
              )}

              {/* Action */}
              <div className="mt-4 pt-4 border-t border-[#E6E6E1] flex justify-between items-center text-xs">
                <span className="text-[#5F6B66]">
                  Weightage: {milestone.total_marks} Marks
                </span>
                {isInProgress ? (
                  <Link
                    to="/student/documents"
                    className="px-4 py-2 rounded-lg bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold transition-colors"
                  >
                    Submit Deliverable
                  </Link>
                ) : isCompleted ? (
                  <Link
                    to="/student/documents"
                    className="text-[#17302A] font-semibold hover:text-[#F59E0B] transition-colors"
                  >
                    View Submitted Document
                  </Link>
                ) : (
                  <span className="text-[#5F6B66] font-medium">Pending Previous Phases</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
