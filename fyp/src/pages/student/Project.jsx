import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import ProgressBar from "../../components/shared/ProgressBar";
import PageHeader from "../../components/shared/PageHeader";
import { studentProject, groupMembers, supervisor, coordinator } from "../../data/mock";

export default function Project() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Project Overview & Architecture"
        description="Detailed project specification, repository links, team roster, and architecture blueprint."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E6E6E1]">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5F6B66]">
                  {studentProject.group} • {studentProject.domain}
                </span>
                <h2 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-[#17302A] mt-1">
                  {studentProject.title}
                </h2>
              </div>
              <Badge variant="in_progress" size="lg">
                In Progress
              </Badge>
            </div>

            <div className="py-6 space-y-6">
              <div>
                <h3 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#17302A] mb-2">
                  System Description
                </h3>
                <p className="text-sm text-[#5F6B66] leading-relaxed">
                  {studentProject.description}
                </p>
              </div>

              <div>
                <h3 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#17302A] mb-2">
                  Key Deliverables
                </h3>
                <ul className="space-y-2 text-sm text-[#5F6B66]">
                  <li className="css-check css-check-dark">
                    Predictive ensemble ML model pipeline for major grain and vegetable commodities
                  </li>
                  <li className="css-check css-check-dark">
                    High-throughput automated ingestion pipeline for regional weather & market APIS
                  </li>
                  <li className="css-check css-check-dark">
                    Responsive React dashboard with historical trends and forecast confidence intervals
                  </li>
                  <li className="css-check css-check-dark">
                    Comprehensive SRS and system architecture IEEE documentation
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#17302A] mb-3">
                  Applied Technology Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {studentProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-xs font-bold bg-[#ECECE8] text-[#17302A] rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <ProgressBar
                  value={studentProject.progress}
                  label="Overall Project Completion"
                  color="ink"
                />
              </div>
            </div>
          </Card>

          {/* Architecture Blueprint Card */}
          <Card className="p-6 sm:p-8">
            <h3 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#17302A] mb-2">
              System Architecture & Module Flow
            </h3>
            <p className="text-xs text-[#5F6B66] mb-6">
              Three-tier cloud architecture with segregated data ingestion, model inference service, and frontend presentation layers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-5 rounded-xl bg-[#F4F4F2] border border-[#E6E6E1]">
                <span className="text-[11px] font-bold uppercase text-[#5F6B66]">Tier 1</span>
                <h4 className="font-['Bricolage_Grotesque'] text-base font-bold text-[#17302A] mt-1">
                  Presentation
                </h4>
                <p className="text-xs text-[#5F6B66] mt-2">
                  React 19 + Tailwind CSS + Chart.js dashboard
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#F4F4F2] border border-[#E6E6E1]">
                <span className="text-[11px] font-bold uppercase text-[#5F6B66]">Tier 2</span>
                <h4 className="font-['Bricolage_Grotesque'] text-base font-bold text-[#17302A] mt-1">
                  Inference API
                </h4>
                <p className="text-xs text-[#5F6B66] mt-2">
                  FastAPI service hosting trained TensorFlow models
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#F4F4F2] border border-[#E6E6E1]">
                <span className="text-[11px] font-bold uppercase text-[#5F6B66]">Tier 3</span>
                <h4 className="font-['Bricolage_Grotesque'] text-base font-bold text-[#17302A] mt-1">
                  Data Persistence
                </h4>
                <p className="text-xs text-[#5F6B66] mt-2">
                  PostgreSQL database & historical price telemetry
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info (1 Col) */}
        <div className="space-y-6">
          {/* Team Roster */}
          <Card className="p-6">
            <h3 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#17302A] mb-4">
              Team Roster
            </h3>
            <div className="space-y-4">
              {groupMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-xl bg-[#F4F4F2] border border-[#E6E6E1]"
                >
                  <p className="font-bold text-sm text-[#17302A]">{member.name}</p>
                  <p className="text-xs text-[#5F6B66]">{member.roll}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-[#ECECE8] text-[#17302A] rounded">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Supervision & Coordination */}
          <Card className="p-6">
            <h3 className="font-['Bricolage_Grotesque'] text-sm font-bold uppercase tracking-wider text-[#17302A] mb-4">
              Supervision Committee
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold uppercase tracking-wider text-[#5F6B66] text-[10px]">
                  Assigned Supervisor
                </span>
                <p className="font-bold text-sm text-[#17302A] mt-0.5">{supervisor.full_name}</p>
                <p className="text-[#5F6B66]">{supervisor.email}</p>
              </div>

              <div className="pt-3 border-t border-[#E6E6E1]">
                <span className="font-bold uppercase tracking-wider text-[#5F6B66] text-[10px]">
                  FYP Coordinator
                </span>
                <p className="font-bold text-sm text-[#17302A] mt-0.5">{coordinator.full_name}</p>
                <p className="text-[#5F6B66]">{coordinator.email}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
