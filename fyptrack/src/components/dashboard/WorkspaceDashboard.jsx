import { useEffect, useState } from "react";

import EmptyState from "../shared/EmptyState";
import ErrorState from "../shared/ErrorState";
import { assignSupervisor, getCurrentUser, getWorkspace, inviteSupervisor, updateProfile } from "../../services/auth";
import "./StudentDashboard.css";

const navigationByRole = {
  student: [
    { label: "Overview", mark: "OV" },
    { label: "My project", mark: "PR" },
    { label: "Similarity lab", mark: "AI" },
    { label: "Past projects", mark: "PA" },
  ],
  supervisor: [
    { label: "Assigned students", mark: "ST" },
    { label: "Projects", mark: "PR" },
  ],
  coordinator: [
    { label: "University records", mark: "UR" },
    { label: "Assignments", mark: "AS" },
    { label: "Project archive", mark: "PA" },
  ],
};

const roleLabels = {
  student: "Student workspace",
  supervisor: "Supervisor workspace",
  coordinator: "Coordinator workspace",
};

const samplePreviousProjects = [
  { id: "archive-1", title: "Smart Campus Energy Monitor", field: "IoT · Sustainability", year: "2024–25", description: "A sensor network and web dashboard that tracks classroom energy usage, identifies peak demand, and recommends practical ways to reduce electricity consumption." },
  { id: "archive-2", title: "Machine Learning Crop Disease Guide", field: "Machine learning · Agriculture", year: "2023–24", description: "A mobile image classification tool that helps farmers identify common crop diseases and review prevention guidance based on leaf photographs." },
  { id: "archive-3", title: "University Appointment Portal", field: "Web systems · Education", year: "2024–25", description: "An online booking and queue management platform for university advising, with appointment reminders and staff availability management." },
  { id: "archive-4", title: "Accessible Public Transport Planner", field: "Mobile systems · Accessibility", year: "2022–23", description: "A route planning application that highlights accessible stops, step-free connections, and service updates for public transport passengers." },
  { id: "archive-5", title: "Student Wellbeing Check-in Platform", field: "Health informatics · Web", year: "2023–24", description: "A privacy-aware student wellbeing platform with self-assessment check-ins, resource recommendations, and referral information for support teams." },
  { id: "archive-6", title: "Secure Laboratory Equipment Booking", field: "Cloud systems · Security", year: "2022–23", description: "A role-based booking service for shared laboratory equipment that records reservations, maintenance windows, and usage history." },
];

const stopWords = new Set(["about", "after", "also", "based", "from", "into", "that", "their", "this", "through", "with", "your", "will", "using", "which", "they", "have", "been", "were", "such", "common", "project"]);

function similarityScore(firstText, secondText) {
  const terms = (text) => text.toLowerCase().match(/[a-z0-9]{3,}/g)?.filter((word) => !stopWords.has(word)) ?? [];
  const firstTerms = terms(firstText);
  const secondTerms = terms(secondText);
  const firstVector = new Map();
  const secondVector = new Map();
  for (const word of firstTerms) firstVector.set(word, (firstVector.get(word) ?? 0) + 1);
  for (const word of secondTerms) secondVector.set(word, (secondVector.get(word) ?? 0) + 1);
  const sharedTerms = [...firstVector.keys()].filter((word) => secondVector.has(word));
  const dotProduct = sharedTerms.reduce((total, word) => total + firstVector.get(word) * secondVector.get(word), 0);
  const firstMagnitude = Math.sqrt([...firstVector.values()].reduce((total, count) => total + count ** 2, 0));
  const secondMagnitude = Math.sqrt([...secondVector.values()].reduce((total, count) => total + count ** 2, 0));
  if (!firstMagnitude || !secondMagnitude) return 0;
  return Math.round((dotProduct / (firstMagnitude * secondMagnitude)) * 100);
}

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
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          setActiveView((view) => navigationByRole[currentUser.role].some((item) => item.label === view)
            ? view
            : navigationByRole[currentUser.role][0].label);
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
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setInvitationStatus("");
    setInvitationToken("");
    try {
      const result = await inviteSupervisor(token, {
        full_name: form.get("full_name"),
        email: form.get("email"),
      });
      setInvitationToken(result.invitation_token);
      setInvitationStatus(`Invitation for ${result.email} expires ${new Date(result.expires_at).toLocaleString()}.`);
      formElement.reset();
      setRefreshVersion((value) => value + 1);
    } catch (requestError) {
      setInvitationStatus(requestError.message);
    }
  }

  async function handleProfileSave(payload) {
    const updatedUser = await updateProfile(token, payload);
    setUser(updatedUser);
    setSettingsOpen(false);
  }

  return (
    <div className="dashboard-shell">
      <header className="site-header">
        <a className="dashboard-brand" href="/" aria-label="FYPTrack home">
          <span className="brand-mark">F</span><span>FYP<span className="brand-light">Track</span></span>
        </a>
        <button className="mobile-menu-toggle" type="button" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
          <span aria-hidden="true">{mobileMenuOpen ? "×" : "☰"}</span><span className="sr-only">Toggle navigation</span>
        </button>
        <nav className={`site-navigation ${mobileMenuOpen ? "is-open" : ""}`} aria-label={`${roleLabels[user.role]} navigation`}>
          {navigation.map((item) => (
            <button className={`top-nav-link ${currentView === item.label ? "is-active" : ""}`} key={item.label} onClick={() => { setActiveView(item.label); setMobileMenuOpen(false); }} type="button">
              <span className="nav-mark" aria-hidden="true">{item.mark}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <span className="role-chip">{user.role}</span>
          <div className="profile-menu-anchor">
            <button className="profile-trigger" type="button" aria-expanded={profileOpen} aria-label={`Profile menu for ${user.full_name}`} onClick={() => setProfileOpen((open) => !open)}>
              <span className="avatar">{getInitials(user.full_name)}</span><span className="profile-name">{user.full_name}</span><span className="profile-caret" aria-hidden="true">⌄</span>
            </button>
            {profileOpen && <div className="profile-dropdown"><strong>{user.full_name}</strong><span>{user.email}</span><button type="button" onClick={() => { setSettingsOpen(true); setProfileOpen(false); }}>Profile &amp; settings</button><button type="button" className="sign-out-link" onClick={onSignOut}>Sign out</button></div>}
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          {user.role === "student" && (
            <StudentWorkspace
              user={user}
              workspace={workspace}
              activeView={currentView}
              onNavigate={setActiveView}
            />
          )}
          {user.role === "supervisor" && (
            <SupervisorWorkspace workspace={workspace} showProjects={currentView === "Projects"} />
          )}
          {user.role === "coordinator" && (
            currentView === "Project archive" ? <ProjectArchive projects={samplePreviousProjects} /> : <CoordinatorWorkspace
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
      <SiteFooter role={user.role} />

      {settingsOpen && <ProfileSettings
        user={user}
        onSave={handleProfileSave}
        onClose={() => setSettingsOpen(false)}
      />}
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
          <span className={`state-label state-${project.status.toLowerCase().replaceAll("_", "-").replaceAll(" ", "-")}`}>
            {project.status.replaceAll("_", " ")}
          </span>
          <small>{project.student_name}{project.supervisor_name ? ` · ${project.supervisor_name}` : ""}</small>
        </article>
      ))}
    </section>
  );
}

function StudentWorkspace({ user, workspace, activeView, onNavigate }) {
  const project = workspace.projects[0];
  const projectText = project ? `${project.title} ${project.description ?? ""}` : "";
  const bestMatch = samplePreviousProjects.reduce(
    (best, previous) => Math.max(best, similarityScore(projectText, `${previous.title} ${previous.description}`)),
    0,
  );

  if (activeView === "Similarity lab") {
    return <SimilarityLab initialText={projectText} projects={samplePreviousProjects} />;
  }
  if (activeView === "Past projects") {
    return <ProjectArchive projects={samplePreviousProjects} />;
  }
  if (activeView === "My project") {
    return (
      <>
        <PageHeading eyebrow="STUDENT WORKSPACE" title="My project" description="Your project details and assigned supervisor." />
        <ProjectList projects={workspace.projects} emptyTitle="No project has been assigned" emptyDescription="Your project record will appear here when your university creates it." />
        <section className="content-panel supervisor-summary"><span className="eyebrow">ASSIGNED SUPERVISOR</span><h2>{workspace.assigned_supervisor || "No supervisor assigned"}</h2><p>{workspace.assigned_supervisor ? "This assignment is managed by your coordinator." : "Your coordinator will assign a supervisor when one is available."}</p></section>
      </>
    );
  }

  return (
    <>
      <section className="welcome-band">
        <div><span className="eyebrow">STUDENT WORKSPACE · 2026–27</span><h1>Good morning, {user.full_name.split(/\s+/)[0]}.</h1><p>Your final year project, supervisor, and research checks in one place.</p></div>
        <button type="button" className="primary-action" onClick={() => onNavigate("Similarity lab")}>Run similarity check <span aria-hidden="true">→</span></button>
      </section>

      <section className="metric-strip" aria-label="Project summary">
        <article className="metric-card"><span className="metric-overline">ACTIVE PROJECT</span><strong>{workspace.projects.length}</strong><span>{workspace.projects.length === 1 ? "Project registered" : "Projects registered"}</span></article>
        <article className="metric-card metric-card-highlight"><span className="metric-overline">HIGHEST ARCHIVE MATCH</span><strong>{bestMatch}%</strong><span>{project ? "Compared with sample projects" : "Add a project to compare"}</span></article>
        <article className="metric-card"><span className="metric-overline">SUPERVISOR</span><strong className="metric-name">{workspace.assigned_supervisor || "Not assigned"}</strong><span>{workspace.assigned_supervisor ? "Active assignment" : "Awaiting coordinator"}</span></article>
      </section>

      <div className="student-content-grid">
        <section className="featured-project">
          <div className="featured-project-top"><span className="eyebrow">CURRENT PROJECT</span><span className="project-status-dot">{project ? project.status.replaceAll("_", " ") : "Not assigned"}</span></div>
          {project ? <><h2>{project.title}</h2><p>{project.description || "A project description has not been added yet."}</p><div className="project-meta"><span>Supervisor</span><strong>{workspace.assigned_supervisor || "Not assigned"}</strong></div><button type="button" className="inline-link" onClick={() => onNavigate("My project")}>View project details <span aria-hidden="true">↗</span></button></> : <EmptyState title="Your project space is ready" description="When your university registers a project, its details and supervisor will appear here." action={<button type="button" className="inline-link" onClick={() => onNavigate("Past projects")}>Explore past projects <span aria-hidden="true">→</span></button>} />}
        </section>

        <section className="similarity-teaser">
          <div className="teaser-orbit" aria-hidden="true"><span>AI</span></div>
          <span className="eyebrow">RESEARCH TOOL</span>
          <h2>Check your idea against the archive</h2>
          <p>Compare your title and abstract with six sample FYP records.</p>
          <button type="button" className="light-action" onClick={() => onNavigate("Similarity lab")}>Open similarity lab <span aria-hidden="true">→</span></button>
          <small>Prototype estimate · not a plagiarism verdict</small>
        </section>
      </div>

      <section className="archive-preview">
        <div className="section-heading"><div><span className="eyebrow">FROM THE ARCHIVE</span><h2>Past projects</h2></div><button type="button" className="inline-link" onClick={() => onNavigate("Past projects")}>Browse all <span aria-hidden="true">→</span></button></div>
        <div className="archive-preview-grid">{samplePreviousProjects.slice(0, 3).map((item) => <article className="archive-mini" key={item.id}><span>{item.field}</span><h3>{item.title}</h3><small>{item.year}</small></article>)}</div>
      </section>
    </>
  );
}

function SimilarityLab({ initialText, projects }) {
  const [draft, setDraft] = useState(initialText);
  const [matches, setMatches] = useState([]);

  function analyze(event) {
    event.preventDefault();
    const results = projects
      .map((project) => ({ ...project, score: similarityScore(draft, `${project.title} ${project.description}`) }))
      .sort((first, second) => second.score - first.score);
    setMatches(results);
  }

  return (
    <>
      <PageHeading eyebrow="RESEARCH TOOL · PROTOTYPE" title="Project similarity lab" description="Compare a project idea with synthetic examples from the FYP archive." />
      <div className="similarity-layout">
        <form className="similarity-input-panel" onSubmit={analyze}>
          <label htmlFor="project-draft">Project title and abstract</label>
          <textarea id="project-draft" minLength="10" required rows="9" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Describe the problem, proposed approach, and intended users..." />
          <div className="similarity-form-foot"><span>{draft.trim().split(/\s+/).filter(Boolean).length} words</span><button className="primary-action" type="submit">Analyze archive <span aria-hidden="true">→</span></button></div>
          <p className="prototype-disclaimer">This local prototype uses weighted word overlap against synthetic records. It is not a trained semantic AI model and must not be used as a plagiarism or originality verdict.</p>
        </form>
        <section className="similarity-results" aria-live="polite">
          <div className="section-heading"><div><span className="eyebrow">REFERENCE RECORDS</span><h2>{matches.length ? "Closest matches" : "Ready to compare"}</h2></div><span className="archive-count">{projects.length} samples</span></div>
          {matches.length ? matches.map((item, index) => <article className="match-row" key={item.id}><div className="match-rank">{String(index + 1).padStart(2, "0")}</div><div className="match-copy"><div><strong>{item.title}</strong><span>{item.field} · {item.year}</span></div><div className="match-meter"><i style={{ width: `${item.score}%` }} /></div></div><strong className="match-score">{item.score}%</strong></article>) : <EmptyState icon="AI" title="Your comparison will appear here" description="Enter a title and abstract, then analyze it against the sample project archive." />}
        </section>
      </div>
    </>
  );
}

function ProjectArchive({ projects }) {
  return (
    <>
      <PageHeading eyebrow="FYP LIBRARY · SAMPLE DATA" title="Past projects" description="Synthetic archive examples for exploring research themes and trying the similarity prototype." />
      <div className="archive-grid">{projects.map((project) => <article className="archive-card" key={project.id}><div className="archive-card-meta"><span>{project.field}</span><time>{project.year}</time></div><h2>{project.title}</h2><p>{project.description}</p><span className="archive-sample-label">SAMPLE RECORD</span></article>)}</div>
    </>
  );
}

function ProfileSettings({ user, onSave, onClose }) {
  const [fullName, setFullName] = useState(user.full_name);
  const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(user.email_updates_enabled);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      await onSave({ full_name: fullName, email_updates_enabled: emailUpdatesEnabled });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="settings-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="settings-dialog" onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="settings-heading"><div><span className="eyebrow">ACCOUNT</span><h2 id="settings-title">Profile &amp; settings</h2></div><button type="button" className="settings-close" aria-label="Close settings" onClick={onClose}>×</button></div>
        <label className="profile-name-field">Full name<input value={fullName} minLength="2" maxLength="120" required onChange={(event) => setFullName(event.target.value)} /></label>
        <dl className="profile-details"><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Role</dt><dd>{user.role}</dd></div><div><dt>Account ID</dt><dd>#{user.id}</dd></div></dl>
        <label className="settings-toggle"><span><strong>Email updates</strong><small>Save your notification preference</small></span><input type="checkbox" checked={emailUpdatesEnabled} onChange={(event) => setEmailUpdatesEnabled(event.target.checked)} /></label>
        <p className="settings-note">Email notification delivery is not enabled yet. This preference is saved to your account.</p>
        {error && <p className="settings-error" role="alert">{error}</p>}
        <div className="settings-actions"><button type="button" className="settings-cancel" onClick={onClose}>Cancel</button><button type="submit" className="settings-save" disabled={isSaving}>{isSaving ? "Saving..." : "Save changes"}</button></div>
      </form>
    </div>
  );
}

function SiteFooter({ role }) {
  const [contactNotice, setContactNotice] = useState("");
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL;

  function handleContactSubmit(event) {
    event.preventDefault();
    if (!supportEmail) {
      setContactNotice("Contact email is not configured. Set VITE_SUPPORT_EMAIL in the frontend environment.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`FYPTrack enquiry from ${form.get("name")}`);
    const body = encodeURIComponent(`From: ${form.get("name")} (${form.get("email")})\n\n${form.get("message")}`);
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    setContactNotice("Your email app should open with this message ready to send.");
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-about"><a className="footer-brand" href="/">FYP<span>Track</span></a><p>Final year projects, thoughtfully managed.</p><span className="footer-role">{role} workspace</span></div>
        <form className="footer-contact" onSubmit={handleContactSubmit}>
          <div className="contact-heading"><div><span>CONTACT</span><h2>Send us a message</h2></div><span className="contact-mail-mark" aria-hidden="true">@</span></div>
          <div className="contact-fields"><label>Your name<input name="name" autoComplete="name" required /></label><label>Email address<input name="email" type="email" autoComplete="email" required /></label></div>
          <label className="contact-message">Message<textarea name="message" rows="3" required /></label>
          <div className="contact-submit-row"><small>{contactNotice || (supportEmail ? `Opens your email app to ${supportEmail}` : "Set VITE_SUPPORT_EMAIL to enable sending")}</small><button type="submit">Write email <span aria-hidden="true">↗</span></button></div>
        </form>
        <small className="footer-copyright">© 2026 FYPTrack · University project workspace</small>
      </div>
    </footer>
  );
}

function SupervisorWorkspace({ workspace, showProjects }) {
  return (
    <>
      <PageHeading eyebrow="SUPERVISOR WORKSPACE" title={showProjects ? "Assigned projects" : "Assigned students"} description="Only students with an active assignment to your account are shown." />
      <section className="stat-grid" aria-label="Supervisor summary">
        <article className="stat-card"><span className="stat-label">ASSIGNED STUDENTS</span><strong>{workspace.students.length}</strong></article>
        <article className="stat-card"><span className="stat-label">PROJECT RECORDS</span><strong>{workspace.projects.length}</strong></article>
        <article className="stat-card"><span className="stat-label">WITHOUT PROJECT</span><strong>{workspace.students.filter((student) => !student.project).length}</strong></article>
      </section>
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
      <section className="stat-grid" aria-label="University record totals">
        <article className="stat-card"><span className="stat-label">STUDENTS</span><strong>{workspace.students.length}</strong></article>
        <article className="stat-card"><span className="stat-label">PROJECTS</span><strong>{workspace.projects.length}</strong></article>
        <article className="stat-card"><span className="stat-label">SUPERVISORS</span><strong>{workspace.supervisors.length}</strong></article>
      </section>
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