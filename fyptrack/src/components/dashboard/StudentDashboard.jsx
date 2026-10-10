import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/auth";
import "./StudentDashboard.css";

const navigation = [
  { label: "Overview", mark: "OV" },
  { label: "My project", mark: "PR" },
  { label: "Milestones", mark: "MS" },
  { label: "Meetings", mark: "MT" },
  { label: "Documents", mark: "DC" },
];

const milestones = [
  { title: "Project proposal", date: "Sep 18, 2026", status: "Completed" },
  { title: "Literature review", date: "Oct 14, 2026", status: "In progress" },
  { title: "System design", date: "Nov 02, 2026", status: "Upcoming" },
  { title: "Mid-project evaluation", date: "Dec 07, 2026", status: "Upcoming" },
];

const documents = [
  { name: "Project proposal.pdf", type: "Proposal", updated: "Sep 18, 2026", state: "Approved" },
  { name: "Research notes.docx", type: "Working document", updated: "Oct 06, 2026", state: "Draft" },
  { name: "Meeting 03 notes.pdf", type: "Meeting notes", updated: "Oct 02, 2026", state: "Reviewed" },
];

function getInitials(name = "Student") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function StudentDashboard({ onSignOut, onSessionExpired }) {
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState("loading");
  const [activeView, setActiveView] = useState("Overview");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([true, false, false]);

  useEffect(() => {
    let isCurrent = true;
    const token = sessionStorage.getItem("fyptrack_access_token");

    if (!token) {
      onSessionExpired();
      return () => {
        isCurrent = false;
      };
    }

    getCurrentUser(token)
      .then((currentUser) => {
        if (isCurrent) {
          setUser(currentUser);
          setAuthStatus("ready");
        }
      })
      .catch(() => {
        if (isCurrent) onSessionExpired();
      });

    return () => {
      isCurrent = false;
    };
  }, [onSessionExpired]);

  if (authStatus === "loading") {
    return (
      <main className="dashboard-loading" aria-live="polite">
        <span className="loading-symbol">F</span>
        <p>Opening your workspace...</p>
      </main>
    );
  }

  if (!user) return null;

  const firstName = user.full_name.split(/\s+/)[0];
  const today = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  function toggleTask(index) {
    setCompletedTasks((current) =>
      current.map((completed, taskIndex) => taskIndex === index ? !completed : completed),
    );
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <a className="dashboard-brand" href="/" aria-label="FYPTrack home">
          <span className="brand-mark">F</span>
          <span>FYP<span className="brand-light">Track</span></span>
        </a>

        <div className="sidebar-caption">WORKSPACE</div>
        <nav className="dashboard-nav" aria-label="Student workspace">
          {navigation.map((item) => (
            <button
              className={`nav-item ${activeView === item.label ? "is-active" : ""}`}
              key={item.label}
              onClick={() => setActiveView(item.label)}
              type="button"
            >
              <span className="nav-mark" aria-hidden="true">{item.mark}</span>
              <span>{item.label}</span>
              {item.label === "Milestones" && <span className="nav-count">2</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-support-mark">?</div>
          <div>
            <strong>Need a hand?</strong>
            <span>Your supervisor is one message away.</span>
          </div>
          <button
            type="button"
            className="support-link"
            onClick={() => setActiveView("Meetings")}
          >
            View meetings <span aria-hidden="true">↗</span>
          </button>
        </div>
        <div className="sidebar-version">FYPTRACK <span>·</span> STUDENT PORTAL</div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="breadcrumb"><span>Workspace</span><i>/</i>{activeView}</div>
          <div className="topbar-actions">
            <span className="preview-label"><span /> Preview workspace</span>
            <div className="menu-anchor">
              <button
                type="button"
                className={`icon-button ${showNotifications ? "selected" : ""}`}
                aria-label="Notifications"
                aria-expanded={showNotifications}
                onClick={() => {
                  setShowNotifications((shown) => !shown);
                  setShowProfileMenu(false);
                }}
              >
                <span className="bell-shape" aria-hidden="true">♧</span>
                <span className="notification-dot" />
              </button>
              {showNotifications && (
                <div className="popover notification-popover">
                  <div className="popover-heading"><strong>Notifications</strong><span>2 new</span></div>
                  <p><b>Milestone due soon</b><span>Literature review is due in 5 days.</span></p>
                  <p><b>Supervisor feedback</b><span>New feedback was added to your proposal.</span></p>
                </div>
              )}
            </div>
            <div className="menu-anchor">
              <button
                type="button"
                className="profile-trigger"
                aria-expanded={showProfileMenu}
                onClick={() => {
                  setShowProfileMenu((shown) => !shown);
                  setShowNotifications(false);
                }}
              >
                <span className="avatar">{getInitials(user.full_name)}</span>
                <span className="profile-name">{user.full_name}</span>
                <span className="chevron" aria-hidden="true">⌄</span>
              </button>
              {showProfileMenu && (
                <div className="popover profile-popover">
                  <span className="profile-email">{user.email}</span>
                  <button type="button" onClick={onSignOut}>Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {activeView === "Overview" && (
            <OverviewView
              firstName={firstName}
              today={today}
              completedTasks={completedTasks}
              onToggleTask={toggleTask}
              onNavigate={setActiveView}
            />
          )}
          {activeView === "My project" && <ProjectView onNavigate={setActiveView} />}
          {activeView === "Milestones" && <MilestonesView />}
          {activeView === "Meetings" && <MeetingsView />}
          {activeView === "Documents" && <DocumentsView />}
        </div>
      </main>
    </div>
  );
}

function PageHeading({ eyebrow, title, description, date }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {date && <div className="today-label">{date}</div>}
    </div>
  );
}

function OverviewView({ firstName, today, completedTasks, onToggleTask, onNavigate }) {
  return (
    <>
      <PageHeading
        eyebrow="STUDENT WORKSPACE"
        title={`Good morning, ${firstName}.`}
        description="A clear view of your final year project, all in one place."
        date={today}
      />

      <section className="project-banner">
        <div className="project-banner-copy">
          <div className="banner-kicker"><span className="status-led" /> ACTIVE PROJECT <span className="banner-divider">/</span> YEAR 2026–27</div>
          <h2>Smart Campus Resource<br className="banner-break" /> Allocation System</h2>
          <p>Building a more efficient way to manage shared campus resources.</p>
          <button type="button" className="light-button" onClick={() => onNavigate("My project")}>
            Open project <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="banner-progress" aria-label="Project completion 64 percent">
          <div className="progress-ring"><span>64<small>%</small></span></div>
          <span>PROJECT<br />COMPLETION</span>
        </div>
        <div className="banner-decoration" aria-hidden="true"><span /><span /><span /></div>
      </section>

      <section className="stat-grid" aria-label="Project summary">
        <article className="stat-card">
          <span className="stat-label">NEXT DEADLINE</span>
          <strong>5 <small>days</small></strong>
          <span className="stat-foot"><span className="mini-marker orange" /> Literature review <time>Oct 14</time></span>
        </article>
        <article className="stat-card">
          <span className="stat-label">MILESTONES</span>
          <strong>2 <small>/ 6</small></strong>
          <span className="stat-foot"><span className="mini-marker green" /> One in progress</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">SUPERVISOR</span>
          <strong className="supervisor-name">Dr. Amina Rahman</strong>
          <span className="stat-foot"><span className="mini-marker green" /> Next meeting Oct 12</span>
        </article>
      </section>

      <div className="overview-grid">
        <section className="content-panel activity-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">YOUR PROJECT</span><h2>Up next</h2></div>
            <button type="button" className="text-button" onClick={() => onNavigate("Milestones")}>All milestones <span aria-hidden="true">→</span></button>
          </div>
          <div className="next-milestone">
            <div className="milestone-date"><strong>14</strong><span>OCT</span></div>
            <div className="next-milestone-copy"><span className="small-status">IN PROGRESS</span><h3>Literature review</h3><p>Review key research and document your findings.</p></div>
            <span className="days-pill">5 days left</span>
          </div>
          <div className="checklist-heading"><strong>Preparation checklist</strong><span>{completedTasks.filter(Boolean).length} of {completedTasks.length} done</span></div>
          <div className="checklist">
            {["Collect 5 relevant research papers", "Group findings by research theme", "Draft the related work section"].map((task, index) => (
              <label className={`checklist-item ${completedTasks[index] ? "is-done" : ""}`} key={task}>
                <input type="checkbox" checked={completedTasks[index]} onChange={() => onToggleTask(index)} />
                <span className="fake-check" aria-hidden="true">✓</span>
                <span>{task}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="content-panel meeting-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">STAY CONNECTED</span><h2>Next meeting</h2></div>
            <button type="button" className="more-button" onClick={() => onNavigate("Meetings")} aria-label="View all meetings">···</button>
          </div>
          <div className="meeting-date-block"><span>MON</span><strong>12</strong><small>OCT</small></div>
          <h3>Weekly project check-in</h3>
          <p className="meeting-time">10:30 AM <span>·</span> 30 minutes</p>
          <div className="meeting-supervisor"><span className="supervisor-avatar">AR</span><span><strong>Dr. Amina Rahman</strong><small>Project supervisor</small></span></div>
          <button type="button" className="outline-button" onClick={() => onNavigate("Meetings")}>Meeting details <span aria-hidden="true">→</span></button>
        </section>
      </div>

      <section className="content-panel recent-panel">
        <div className="panel-heading">
          <div><span className="eyebrow">LATEST UPDATES</span><h2>Recent activity</h2></div>
          <button type="button" className="text-button" onClick={() => onNavigate("Documents")}>View documents <span aria-hidden="true">→</span></button>
        </div>
        <div className="activity-row"><span className="activity-icon icon-document">D</span><span><strong>Proposal approved</strong><small>Your project proposal was approved by Dr. Amina Rahman.</small></span><time>Sep 18</time></div>
        <div className="activity-row"><span className="activity-icon icon-feedback">F</span><span><strong>New supervisor feedback</strong><small>Feedback was added to your project proposal.</small></span><time>Oct 06</time></div>
      </section>
      <div className="preview-note"><span>i</span> Preview content shown. Project records will appear here once project management is connected.</div>
    </>
  );
}

function ProjectView({ onNavigate }) {
  return (
    <>
      <PageHeading eyebrow="PROJECT WORKSPACE" title="My project" description="Your project details, team, and current stage." />
      <section className="project-detail-banner">
        <div><span className="small-status">IN PROGRESS</span><h2>Smart Campus Resource Allocation System</h2><p>Building a more efficient way to manage shared campus resources.</p></div>
        <div className="detail-progress"><strong>64%</strong><span>Overall progress</span><div><i /></div></div>
      </section>
      <div className="detail-grid">
        <section className="content-panel detail-panel"><span className="eyebrow">PROJECT SUMMARY</span><h2>About this project</h2><p className="body-copy">This project explores how a centralized digital platform can help students and staff discover, reserve, and manage shared campus facilities with less friction.</p><div className="tag-list"><span>Web application</span><span>Resource management</span><span>Academic year 2026–27</span></div><button type="button" className="text-button" onClick={() => onNavigate("Milestones")}>Explore project milestones <span aria-hidden="true">→</span></button></section>
        <section className="content-panel detail-panel"><span className="eyebrow">YOUR SUPERVISOR</span><h2>Dr. Amina Rahman</h2><p className="body-copy">Department of Computer Science</p><div className="supervisor-contact"><span className="supervisor-avatar">AR</span><span><strong>Weekly check-in</strong><small>Monday · 10:30 AM</small></span></div><button type="button" className="outline-button" onClick={() => onNavigate("Meetings")}>View meetings <span aria-hidden="true">→</span></button></section>
      </div>
      <div className="preview-note"><span>i</span> Preview content shown. Project records will appear here once project management is connected.</div>
    </>
  );
}

function MilestonesView() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Upcoming", "Completed"];
  const visibleMilestones = milestones.filter((item) => filter === "All" || item.status === filter);

  return (
    <>
      <PageHeading eyebrow="PROJECT PLAN" title="Milestones" description="Track the key submissions and review points in your project." />
      <section className="content-panel list-panel">
        <div className="list-toolbar"><div className="filter-group" aria-label="Filter milestones">{filters.map((option) => <button type="button" className={filter === option ? "selected" : ""} key={option} onClick={() => setFilter(option)}>{option}</button>)}</div><span className="list-count">{visibleMilestones.length} milestones</span></div>
        <div className="milestone-list">{visibleMilestones.map((item, index) => <article className="milestone-list-row" key={item.title}><span className={`timeline-node ${item.status.toLowerCase().replace(" ", "-")}`}>{item.status === "Completed" ? "✓" : String(index + 1).padStart(2, "0")}</span><div className="milestone-list-copy"><strong>{item.title}</strong><span>Project milestone</span></div><time>{item.date}</time><span className={`state-label state-${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span></article>)}</div>
      </section>
      <div className="preview-note"><span>i</span> Preview milestones are examples and are not saved to your account.</div>
    </>
  );
}

function MeetingsView() {
  return (
    <>
      <PageHeading eyebrow="SUPERVISION" title="Meetings" description="Keep track of conversations and upcoming check-ins with your supervisor." />
      <section className="meeting-feature content-panel"><div className="meeting-feature-date"><span>MONDAY</span><strong>12</strong><small>OCTOBER 2026</small></div><div className="meeting-feature-copy"><span className="small-status">UPCOMING</span><h2>Weekly project check-in</h2><p>Review literature progress and agree on next steps.</p><div className="meeting-supervisor"><span className="supervisor-avatar">AR</span><span><strong>Dr. Amina Rahman</strong><small>Supervisor</small></span></div></div><div className="meeting-feature-time"><strong>10:30 AM</strong><span>30 minutes</span><button type="button" className="outline-button" onClick={() => window.alert("Meeting details are part of the upcoming meetings integration.")}>View details <span aria-hidden="true">→</span></button></div></section>
      <section className="content-panel list-panel"><div className="panel-heading"><div><span className="eyebrow">PAST SESSIONS</span><h2>Meeting history</h2></div><span className="list-count">2 sessions</span></div><div className="meeting-history-row"><span className="history-date">OCT <b>02</b></span><span><strong>Research direction review</strong><small>Notes and action points</small></span><span className="state-label state-reviewed">Notes added</span></div><div className="meeting-history-row"><span className="history-date">SEP <b>21</b></span><span><strong>Project scope discussion</strong><small>Notes and action points</small></span><span className="state-label state-reviewed">Notes added</span></div></section>
      <div className="preview-note"><span>i</span> Preview meetings are examples and are not saved to your account.</div>
    </>
  );
}

function DocumentsView() {
  return (
    <>
      <PageHeading eyebrow="PROJECT FILES" title="Documents" description="Your submissions, working files, and supervisor-reviewed documents." />
      <section className="content-panel list-panel document-panel">
        <div className="list-toolbar"><div><strong>Project documents</strong><span className="list-count">3 files</span></div><button type="button" className="outline-button" onClick={() => window.alert("Document upload will be available when file storage is connected.")}>＋ <span>Upload document</span></button></div>
        <div className="document-table"><div className="document-table-head"><span>NAME</span><span>TYPE</span><span>LAST UPDATED</span><span>STATUS</span></div>{documents.map((document) => <div className="document-row" key={document.name}><span className="document-name"><span className="file-mark">PDF</span><strong>{document.name}</strong></span><span>{document.type}</span><time>{document.updated}</time><span className={`state-label state-${document.state.toLowerCase()}`}>{document.state}</span></div>)}</div>
      </section>
      <div className="preview-note"><span>i</span> Preview documents are examples. Upload and storage will be connected in a later phase.</div>
    </>
  );
}

export default StudentDashboard;