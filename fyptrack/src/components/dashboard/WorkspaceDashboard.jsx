import { useEffect, useState } from "react";

import EmptyState from "../shared/EmptyState";
import ErrorState from "../shared/ErrorState";
import { assignSupervisor, getCurrentUser, getWorkspace, inviteSupervisor } from "../../services/auth";
import "./StudentDashboard.css";

const navigationByRole = {
  student: [
    { label: "Overview", mark: "OV" },
    { label: "My project", mark: "PR" },
  ],
  supervisor: [
    { label: "Assigned students", mark: "ST" },
    { label: "Projects", mark: "PR" },
  ],
  coordinator: [
    { label: "University records", mark: "UR" },
    { label: "Assignments", mark: "AS" },
  ],
};

const roleLabels = {
  student: "Student workspace",
  supervisor: "Supervisor workspace",
  coordinator: "Coordinator workspace",
};

function getInitials(name = "User") {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function WorkspaceDashboard({ onSignOut, onSessionExpired }) {
  const token = sessionStorage.getItem("fyptrack_access_token");
  const [user, setUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [assignmentStatus, setAssignmentStatus] = useState("");
  const [invitationStatus, setInvitationStatus] = useState("");
  const [invitationToken, setInvitationToken] = useState("");
  const [activeView, setActiveView] = useState("Overview");

  useEffect(() => {
    let isCurrent = true;
    async function loadWorkspace() {
      if (!token) {
        onSessionExpired();
        return;
      }
      setStatus("loading");
      setError("");
      try {
        const currentUser = await getCurrentUser(token);
        if (!navigationByRole[currentUser.role]) {
          throw new Error("Your account has an unsupported role.");
        }
        const userWorkspace = await getWorkspace(currentUser.role, token);
        if (isCurrent) {
          setUser(currentUser);
          setWorkspace(userWorkspace);
          setStatus("ready");
          setActiveView(navigationByRole[currentUser.role][0].label);
        }
      } catch (requestError) {
        if (!isCurrent) return;
        if (requestError.status === 401) {
          onSessionExpired();
          return;
        }
        setError(requestError.message);
        setStatus("error");
      }
    }
    loadWorkspace();
    return () => { isCurrent = false; };
  }, [token, onSessionExpired, refreshVersion]);

  if (status === "loading") {
    return <main className="dashboard-loading" aria-live="polite"><span className="loading-symbol">F</span><p>Verifying your account and loading its records...</p></main>;
  }
  if (status === "error") {
    return <main className="dashboard-loading"><ErrorState message={error} onRetry={() => setRefreshVersion((value) => value + 1)} /></main>;
  }
  if (!user || !workspace) return null;

  const navigation = navigationByRole[user.role];
  const currentView = navigation.some((item) => item.label === activeView) ? activeView : navigation[0].label;

  async function handleAssignment(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setAssignmentStatus("");
    try {
      const result = await assignSupervisor(token, form.get("student_user_id"), form.get("supervisor_user_id"));
      setAssignmentStatus(result.message);
      setRefreshVersion((value) => value + 1);
    } catch (requestError) {
      setAssignmentStatus(requestError.message);
    }
  }

  async function handleInvitation(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setInvitationStatus("");
    setInvitationToken("");
    try {
      const result = await inviteSupervisor(token, {
        full_name: form.get("full_name"),
        email: form.get("email"),
      });
      setInvitationToken(result.invitation_token);
      setInvitationStatus(`Invitation for ${result.email} expires ${new Date(result.expires_at).toLocaleString()}.`);
      event.currentTarget.reset();
      setRefreshVersion((value) => value + 1);
    } catch (requestError) {
      setInvitationStatus(requestError.message);
    }
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <a className="dashboard-brand" href="/" aria-label="FYPTrack home">
          <span className="brand-mark">F</span><span>FYP<span className="brand-light">Track</span></span>
        </a>
        <div className="sidebar-caption">WORKSPACE</div>
        <nav className="dashboard-nav" aria-label={roleLabels[user.role]}>
          {navigation.map((item) => (
            <button className={`nav-item ${currentView === item.label ? "is-active" : ""}`} key={item.label} onClick={() => setActiveView(item.label)} type="button">
              <span className="nav-mark" aria-hidden="true">{item.mark}</span><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-support-mark" aria-hidden="true">{user.role[0].toUpperCase()}</div>
          <div><strong>{roleLabels[user.role]}</strong><span>{user.role === "student" ? "Your own project records" : user.role === "supervisor" ? "Your assigned students" : "University FYP records"}</span></div>
        </div>
        <div className="sidebar-version">FYPTRACK <span>·</span> {user.role.toUpperCase()}</div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="breadcrumb"><span>{roleLabels[user.role]}</span><i>/</i>{currentView}</div>
          <div className="topbar-actions">
            <span className="profile-trigger"><span className="avatar">{getInitials(user.full_name)}</span><span className="profile-name">{user.full_name}</span></span>
            <button type="button" className="outline-button" onClick={onSignOut}>Sign out</button>
          </div>
        </header>
        <div className="dashboard-content">
          {user.role === "student" && (
            <StudentWorkspace user={user} workspace={workspace} showProject={currentView === "My project"} />
          )}
          {user.role === "supervisor" && (
            <SupervisorWorkspace workspace={workspace} showProjects={currentView === "Projects"} />
          )}
          {user.role === "coordinator" && (
            <CoordinatorWorkspace
              workspace={workspace}
              showAssignments={currentView === "Assignments"}
              onAssignmentSubmit={handleAssignment}
              assignmentStatus={assignmentStatus}
              onInvitationSubmit={handleInvitation}
              invitationStatus={invitationStatus}
              invitationToken={invitationToken}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div></div>;
}

function ProjectList({ projects, emptyTitle, emptyDescription }) {
  if (!projects.length) return <EmptyState icon="P" title={emptyTitle} description={emptyDescription} />;
  return (
    <section className="content-panel workspace-list">
      {projects.map((project) => (
        <article className="workspace-record" key={project.id}>
          <div><strong>{project.title}</strong><span>{project.description || "No project description provided."}</span></div>
          <span className="state-label">{project.status.replaceAll("_", " ")}</span>
          <small>{project.student_name}{project.supervisor_name ? ` · ${project.supervisor_name}` : ""}</small>
        </article>
      ))}
    </section>
  );
}

function StudentWorkspace({ user, workspace, showProject }) {
  const project = workspace.projects[0];
  return (
    <>
      <PageHeading eyebrow="STUDENT WORKSPACE" title={showProject ? "My project" : `Welcome, ${user.full_name.split(/\s+/)[0]}.`} description="Your project and assigned supervisor, loaded from your account." />
      {!showProject && project && <section className="project-banner"><div className="project-banner-copy"><div className="banner-kicker"><span className="status-led" /> YOUR PROJECT</div><h2>{project.title}</h2><p>{project.description || "Project details will be added by your university."}</p></div></section>}
      {showProject && <ProjectList projects={workspace.projects} emptyTitle="No project has been assigned" emptyDescription="Your project record will appear here when it is created by your university." />}
      <section className="content-panel supervisor-summary"><span className="eyebrow">ASSIGNED SUPERVISOR</span><h2>{workspace.assigned_supervisor || "No supervisor assigned"}</h2><p>{workspace.assigned_supervisor ? "Your supervisor assignment is recorded by the coordinator." : "Your coordinator will assign a supervisor when one is available."}</p></section>
      {!showProject && !project && <div className="workspace-empty"><EmptyState icon="P" title="No project yet" description="Your workspace is ready. Project records will appear once they are created by your university." /></div>}
    </>
  );
}

function SupervisorWorkspace({ workspace, showProjects }) {
  return (
    <>
      <PageHeading eyebrow="SUPERVISOR WORKSPACE" title={showProjects ? "Assigned projects" : "Assigned students"} description="Only students with an active assignment to your account are shown." />
      {showProjects ? (
        <ProjectList projects={workspace.projects} emptyTitle="No assigned projects" emptyDescription="Projects for your assigned students will appear here." />
      ) : workspace.students.length ? (
        <section className="content-panel workspace-list">
          {workspace.students.map((student) => (
            <article className="workspace-record" key={student.id}>
              <div><strong>{student.full_name}</strong><span>{student.email}</span></div>
              <small>{student.project?.title || "No project record"}</small>
            </article>
          ))}
        </section>
      ) : <EmptyState icon="S" title="No students assigned" description="Students will appear here after a coordinator assigns them to you." />}
    </>
  );
}

function CoordinatorWorkspace({ workspace, showAssignments, onAssignmentSubmit, assignmentStatus, onInvitationSubmit, invitationStatus, invitationToken }) {
  return (
    <>
      <PageHeading eyebrow="COORDINATOR WORKSPACE" title={showAssignments ? "People and assignments" : "University FYP records"} description="Administrative records and actions available to coordinator accounts." />
      {showAssignments ? (
        <div className="workspace-action-grid">
          <section className="content-panel workspace-form-panel">
            <h2>Assign supervisor</h2>
            {!workspace.students.length || !workspace.supervisors.length ? <EmptyState title="Accounts needed" description="At least one student and one activated supervisor are required." /> : (
              <form className="workspace-form" onSubmit={onAssignmentSubmit}>
                <label>Student<select name="student_user_id" required defaultValue=""><option value="" disabled>Select student</option>{workspace.students.map((student) => <option key={student.id} value={student.id}>{student.full_name} · {student.email}</option>)}</select></label>
                <label>Supervisor<select name="supervisor_user_id" required defaultValue=""><option value="" disabled>Select supervisor</option>{workspace.supervisors.map((supervisor) => <option key={supervisor.id} value={supervisor.id}>{supervisor.full_name} · {supervisor.email}</option>)}</select></label>
                <button type="submit" className="outline-button">Save assignment</button>
              </form>
            )}
            {assignmentStatus && <p className="workspace-feedback" role="status">{assignmentStatus}</p>}
          </section>
          <section className="content-panel workspace-form-panel">
            <h2>Invite supervisor</h2>
            <form className="workspace-form" onSubmit={onInvitationSubmit}>
              <label>Full name<input name="full_name" minLength="2" maxLength="120" required /></label>
              <label>University email<input name="email" type="email" maxLength="320" required /></label>
              <button type="submit" className="outline-button">Create invitation</button>
            </form>
            {invitationStatus && <p className="workspace-feedback" role="status">{invitationStatus}</p>}
            {invitationToken && <label className="invitation-token">Single-use activation token<textarea readOnly rows="3" value={invitationToken} /></label>}
          </section>
        </div>
      ) : (
        <>
          <section className="stat-grid" aria-label="University record totals">
            <article className="stat-card"><span className="stat-label">STUDENTS</span><strong>{workspace.students.length}</strong></article>
            <article className="stat-card"><span className="stat-label">PROJECTS</span><strong>{workspace.projects.length}</strong></article>
            <article className="stat-card"><span className="stat-label">SUPERVISORS</span><strong>{workspace.supervisors.length}</strong></article>
          </section>
          <section className="content-panel workspace-list coordinator-records">
            <div className="panel-heading"><div><span className="eyebrow">STUDENT REGISTER</span><h2>Students and active assignments</h2></div></div>
            {workspace.students.length ? workspace.students.map((student) => (
              <article className="workspace-record" key={student.id}><div><strong>{student.full_name}</strong><span>{student.email}</span></div><small>{student.project?.title || "No project"}</small><small>{student.supervisor_name || "No supervisor assigned"}</small></article>
            )) : <EmptyState title="No student records" description="Student accounts will appear here after signup." />}
          </section>
          <ProjectList projects={workspace.projects} emptyTitle="No project records" emptyDescription="Projects will appear when the university adds them." />
        </>
      )}
    </>
  );
}

export default WorkspaceDashboard;