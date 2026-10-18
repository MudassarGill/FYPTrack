import { Link } from "react-router-dom";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import ProgressBar from "../../components/shared/ProgressBar";
import StatCard from "../../components/shared/StatCard";
import PageHeader from "../../components/shared/PageHeader";
import {
  currentStudent,
  studentProject,
  supervisor,
  proposal,
  milestones,
  supervisorFeedback,
  upcomingDeadlines,
  groupMembers,
  quickActions,
} from "../../data/mock";

export default function Dashboard() {
  const completedMilestones = milestones.filter((m) => m.status === "completed").length;
  const activeMilestone = milestones.find((m) => m.status === "in_progress") || milestones[0];
  const recentFeedback = supervisorFeedback.slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title={`Welcome back, ${currentStudent.full_name}`}
        description={`Roll No: ${currentStudent.roll_number} | Group 14 | BS Software Engineering`}
        action={
          <Link
            to="/student/documents"
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-[#EBB44B] hover:bg-[#DDA53A] text-[#17302A] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Submit Deliverable
          </Link>
        }
      />

      {/* High-level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Project Progress"
          value={`${studentProject.progress}%`}
          subtext="Overall completion across all milestones"
        />
        <StatCard
          label="Milestones"
          value={`${completedMilestones} / ${milestones.length}`}
          subtext="3 completed, 1 in progress"
        />
        <StatCard
          label="Proposal Status"
          value={proposal.status.toUpperCase()}
          subtext={`Similarity score: ${proposal.similarity_score}%`}
          highlight={true}
        />
        <StatCard
          label="Supervisor"
          value={supervisor.full_name}
          subtext={`${supervisor.department} (${supervisor.topic_match}% match)`}
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Project Card */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6E6E1]">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5F6B66]">
                  Active FYP Project
                </span>
                <h2 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#17302A] mt-0.5">
                  {studentProject.title}
                </h2>
              </div>
              <Badge variant={studentProject.status}>
                In Progress
              </Badge>
            </div>

            <p className="mt-4 text-sm text-[#5F6B66] leading-relaxed">
              {studentProject.description}
            </p>

            <div className="mt-6 pt-4 border-t border-[#E6E6E1] space-y-3">
              <ProgressBar
                value={studentProject.progress}
                label="Completion Progress"
                color="ink"
              />
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-semibold text-[#5F6B66]">Tech Stack:</span>
                {studentProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-medium bg-[#ECECE8] text-[#17302A] rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Active Milestone Card */}
          {activeMilestone && (
            <Card className="p-6 border-l-4 border-l-[#EBB44B]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                    Current Target Deliverable
                  </span>
                  <h3 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#17302A] mt-1">
                    {activeMilestone.name}
                  </h3>
                  <p className="text-xs text-[#5F6B66] mt-1">
                    Due Date: <span className="font-semibold text-[#17302A]">{activeMilestone.due_date}</span> | Weightage: {activeMilestone.total_marks} Marks
                  </p>
                </div>
                <Link
                  to="/student/documents"
                  className="inline-block px-4 py-2 text-xs font-bold rounded-lg bg-[#17302A] hover:bg-[#24493F] text-white transition-colors text-center shrink-0"
                >
                  Upload Files
                </Link>
              </div>
              <div className="mt-4">
                <ProgressBar
                  value={activeMilestone.progress}
                  label="Milestone Progress"
                  color="amber"
                  height="h-2"
                />
              </div>
            </Card>
          )}

          {/* Recent Feedback Feed */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#17302A]">
                Recent Supervisor Feedback
              </h3>
              <Link
                to="/student/feedback"
                className="text-xs font-semibold text-[#17302A] hover:text-[#F59E0B] transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 rounded-xl bg-[#F4F4F2] border border-[#E6E6E1]/60"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#17302A]">{fb.from}</span>
                      <span className="text-[11px] text-[#5F6B66]">({fb.milestone})</span>
                    </div>
                    <span className="text-[11px] text-[#5F6B66] font-medium">{fb.date}</span>
                  </div>
                  <p className="text-xs text-[#5F6B66] leading-relaxed">
                    {fb.message}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Deadlines, Team, Supervisor */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#17302A] mb-4">
              Quick Shortcuts
            </h3>
            <div className="space-y-2">
              {quickActions.map((qa) => (
                <Link
                  key={qa.label}
                  to={qa.href}
                  className="block px-4 py-2.5 rounded-xl bg-[#F4F4F2] hover:bg-[#ECECE8] text-xs font-semibold text-[#17302A] transition-colors"
                >
                  {qa.label}
                </Link>
              ))}
            </div>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="p-6">
            <h3 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#17302A] mb-4">
              Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {upcomingDeadlines.map((dl, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#F4F4F2] text-xs"
                >
                  <div>
                    <p className="font-bold text-[#17302A]">{dl.milestone}</p>
                    <p className="text-[11px] text-[#5F6B66] mt-0.5">{dl.date}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md font-bold text-[11px] bg-[#FEF3D6] text-[#6B4700]">
                    {dl.daysLeft} days left
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Group Members */}
          <Card className="p-6">
            <h3 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#17302A] mb-4">
              Project Group (Group 14)
            </h3>
            <div className="space-y-3">
              {groupMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between text-xs py-1 border-b border-[#E6E6E1] last:border-0"
                >
                  <div>
                    <p className="font-bold text-[#17302A]">{member.name}</p>
                    <p className="text-[11px] text-[#5F6B66]">{member.roll}</p>
                  </div>
                  <span className="text-[11px] font-medium text-[#5F6B66]">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Assigned Supervisor */}
          <Card className="p-6">
            <h3 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#17302A] mb-4">
              Project Supervisor
            </h3>
            <div className="space-y-2">
              <p className="font-bold text-sm text-[#17302A]">{supervisor.full_name}</p>
              <p className="text-xs text-[#5F6B66]">{supervisor.department}</p>
              <p className="text-xs text-[#5F6B66]">
                Specialization: {supervisor.specialization}
              </p>
              <div className="pt-2">
                <a
                  href={`mailto:${supervisor.email}`}
                  className="inline-block text-xs font-semibold text-[#17302A] hover:text-[#F59E0B] underline"
                >
                  {supervisor.email}
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
