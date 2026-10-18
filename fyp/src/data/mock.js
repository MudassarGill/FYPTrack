/* ============================================================
   Mock Data – replace with FastAPI calls later
   ============================================================ */

export const currentStudent = {
  id: 1,
  full_name: "Muhammad Ali Khan",
  email: "ali.khan@students.university.edu",
  role: "student",
  roll_number: "FA20-BSE-042",
  initials: "MA",
  avatar_color: "#EBB44B",
};

export const studentProject = {
  id: 101,
  title: "Crop Price Prediction System Using Machine Learning",
  description:
    "An intelligent system that predicts crop prices based on historical data, weather patterns and market trends using ensemble ML models.",
  domain: "Machine Learning",
  technologies: ["Python", "TensorFlow", "Flask", "PostgreSQL", "React"],
  start_date: "2026-09-15",
  status: "in_progress",
  group: "Group 14",
  progress: 43,
};

export const supervisor = {
  id: 10,
  full_name: "Dr. Imran Shah",
  email: "imran.shah@university.edu",
  department: "Computer Science",
  specialization: "Machine Learning and Data Science",
  free_slots: 2,
  topic_match: 92,
  assigned_students: 6,
};

export const coordinator = {
  id: 20,
  full_name: "Dr. Ayesha Malik",
  email: "ayesha.malik@university.edu",
  department: "Computer Science",
};

export const proposal = {
  id: 201,
  title: "Crop Price Prediction System Using Machine Learning",
  domain: "Machine Learning",
  abstract:
    "This project aims to develop an intelligent crop price prediction system leveraging ensemble machine learning techniques. The system will analyze historical pricing data, seasonal weather patterns, and regional market trends to provide accurate price forecasts for major crops. The platform will feature a web-based dashboard for farmers and agricultural stakeholders.",
  technologies: "Python, TensorFlow, Flask, PostgreSQL, React",
  status: "approved",
  submitted_at: "2026-09-20",
  reviewed_at: "2026-09-28",
  similarity_score: 6.2,
  review_steps: [
    { label: "Submitted", status: "completed", date: "Sep 20, 2026" },
    { label: "AI similarity check", status: "completed", date: "Sep 21, 2026" },
    { label: "Coordinator review", status: "completed", date: "Sep 28, 2026" },
    { label: "Supervisor assigned", status: "completed", date: "Oct 01, 2026" },
  ],
};

export const milestones = [
  {
    id: 1,
    name: "Literature Review",
    due_date: "2026-10-10",
    status: "completed",
    progress: 100,
    marks: 18,
    total_marks: 20,
    evaluation_comment: "Thorough review covering all relevant literature.",
  },
  {
    id: 2,
    name: "SRS Document",
    due_date: "2026-10-25",
    status: "completed",
    progress: 100,
    marks: 16,
    total_marks: 20,
    evaluation_comment: "Well-structured. Minor gaps in non-functional requirements.",
  },
  {
    id: 3,
    name: "System Design",
    due_date: "2026-11-15",
    status: "completed",
    progress: 100,
    marks: 17,
    total_marks: 20,
    evaluation_comment: "Clean architecture diagram. Good use of design patterns.",
  },
  {
    id: 4,
    name: "Prototype Demo",
    due_date: "2026-12-01",
    status: "in_progress",
    progress: 65,
    marks: null,
    total_marks: 20,
    evaluation_comment: null,
  },
  {
    id: 5,
    name: "Testing Report",
    due_date: "2026-12-20",
    status: "upcoming",
    progress: 0,
    marks: null,
    total_marks: 15,
    evaluation_comment: null,
  },
  {
    id: 6,
    name: "Final Report",
    due_date: "2027-01-15",
    status: "upcoming",
    progress: 0,
    marks: null,
    total_marks: 25,
    evaluation_comment: null,
  },
  {
    id: 7,
    name: "Final Defense",
    due_date: "2027-01-30",
    status: "upcoming",
    progress: 0,
    marks: null,
    total_marks: 30,
    evaluation_comment: null,
  },
];

export const documents = [
  {
    id: 1,
    name: "Literature_Review_v2.pdf",
    uploaded_at: "2026-10-08",
    status: "approved",
    size: "2.4 MB",
    milestone: "Literature Review",
  },
  {
    id: 2,
    name: "SRS_Document_Final.pdf",
    uploaded_at: "2026-10-23",
    status: "approved",
    size: "3.1 MB",
    milestone: "SRS Document",
  },
  {
    id: 3,
    name: "System_Architecture.pdf",
    uploaded_at: "2026-11-12",
    status: "approved",
    size: "1.8 MB",
    milestone: "System Design",
  },
  {
    id: 4,
    name: "Prototype_Screenshots.pdf",
    uploaded_at: "2026-11-28",
    status: "pending",
    size: "5.2 MB",
    milestone: "Prototype Demo",
  },
  {
    id: 5,
    name: "Dataset_Description.pdf",
    uploaded_at: "2026-10-15",
    status: "approved",
    size: "890 KB",
    milestone: "Literature Review",
  },
];

export const feedbackList = [
  {
    id: 1,
    from: "Dr. Imran Shah",
    date: "2026-11-14",
    milestone: "System Design",
    message:
      "Good progress on the architecture. Consider adding a caching layer for the prediction API to handle concurrent requests more efficiently.",
    read: true,
  },
  {
    id: 2,
    from: "Dr. Imran Shah",
    date: "2026-10-24",
    milestone: "SRS Document",
    message:
      "The functional requirements are well-defined. Please add more detail to the non-functional requirements, especially regarding response time and scalability.",
    read: true,
  },
  {
    id: 3,
    from: "Dr. Imran Shah",
    date: "2026-11-28",
    milestone: "Prototype Demo",
    message:
      "The data pipeline looks solid. Make sure you validate input data before feeding it into the model. Also, add error handling for missing weather data.",
    read: false,
  },
  {
    id: 4,
    from: "Dr. Ayesha Malik",
    date: "2026-10-02",
    milestone: "Proposal",
    message:
      "Proposal approved. The project scope is well-defined and aligns with department priorities. Dr. Imran Shah has been assigned as your supervisor.",
    read: true,
  },
];

export const supervisorFeedback = feedbackList;

export const notifications = [
  {
    id: 1,
    title: "New feedback on Prototype Demo",
    message: "Dr. Imran Shah left feedback on your prototype demo submission.",
    date: "2026-11-28",
    read: false,
    type: "feedback",
  },
  {
    id: 2,
    title: "Deadline approaching: Testing Report",
    message: "Your Testing Report is due on Dec 20, 2026. Start preparing early.",
    date: "2026-11-25",
    read: false,
    type: "deadline",
  },
  {
    id: 3,
    title: "Document approved",
    message: "Your System_Architecture.pdf has been approved by your supervisor.",
    date: "2026-11-15",
    read: true,
    type: "document",
  },
  {
    id: 4,
    title: "Milestone completed: System Design",
    message: "System Design milestone has been marked as completed. Marks: 17/20.",
    date: "2026-11-15",
    read: true,
    type: "milestone",
  },
  {
    id: 5,
    title: "Supervisor assigned",
    message: "Dr. Imran Shah has been assigned as your project supervisor.",
    date: "2026-10-01",
    read: true,
    type: "supervisor",
  },
  {
    id: 6,
    title: "Proposal approved",
    message: "Your proposal has been approved by the FYP coordinator.",
    date: "2026-09-28",
    read: true,
    type: "proposal",
  },
];

export const groupMembers = [
  { id: 1, name: "Muhammad Ali Khan", roll: "FA20-BSE-042", role: "Team Lead" },
  { id: 2, name: "Ayesha Noor", roll: "FA20-BSE-015", role: "ML Engineer" },
  { id: 3, name: "Hassan Raza", roll: "FA20-BSE-038", role: "Backend Developer" },
];

export const upcomingDeadlines = [
  { milestone: "Prototype Demo", date: "Dec 01, 2026", daysLeft: 14 },
  { milestone: "Testing Report", date: "Dec 20, 2026", daysLeft: 33 },
  { milestone: "Final Report", date: "Jan 15, 2027", daysLeft: 59 },
];

export const quickActions = [
  { label: "Upload document", href: "/student/documents" },
  { label: "View milestones", href: "/student/milestones" },
  { label: "Check feedback", href: "/student/feedback" },
  { label: "Update profile", href: "/student/profile" },
];

/* ============================================================
   Home Page Data
   ============================================================ */
export const homeStats = [
  { big: "3 portals", text: "Student, supervisor, coordinator" },
  { big: "1 platform", text: "Proposals to final evaluation" },
  { big: "AI-assisted", text: "Supervisor matching and similarity" },
  { big: "Real time", text: "Progress and deadline tracking" },
];

export const homeFeatures = [
  {
    title: "Proposal management",
    text: "Students submit, supervisors review, coordinators decide. Every status is visible.",
    img: "/images/feature-proposal.webp",
    alt: "Students working on a laptop preparing a project proposal",
  },
  {
    title: "Milestones and deadlines",
    text: "Set deadlines once. Students see what is due and supervisors see who is late.",
    img: "/images/feature-milestones.webp",
    alt: "Planning board with deadline cards and sticky notes",
  },
  {
    title: "AI supervisor matching",
    text: "Recommendations based on topic fit and workload. The coordinator makes the final call.",
    img: "/images/feature-matching.webp",
    alt: "Student meeting a professor in an office",
  },
  {
    title: "Similarity check",
    text: "Compare new proposals with earlier projects before approval.",
    img: "/images/feature-similarity.webp",
    alt: "Person reading documents side by side on a desk",
  },
  {
    title: "Feedback in one thread",
    text: "Comments stay attached to the work they belong to.",
    img: "/images/feature-feedback.webp",
    alt: "Teacher giving written feedback to a student",
  },
  {
    title: "Department reports",
    text: "Progress by stage, supervisor load and pending decisions at a glance.",
    img: "/images/feature-reports.webp",
    alt: "Charts and analytics displayed on a laptop screen",
  },
];

export const homeRoles = [
  {
    title: "Students",
    variant: "light",
    items: [
      "Proposal and project details",
      "Milestones and deadlines",
      "Document uploads",
      "Supervisor feedback",
    ],
  },
  {
    title: "Supervisors",
    variant: "light",
    items: [
      "Assigned students",
      "Proposal and document review",
      "Progress monitoring",
      "Evaluation and marks",
    ],
  },
  {
    title: "FYP Coordinators",
    variant: "dark",
    items: [
      "Proposal decisions",
      "AI supervisor recommendations",
      "Similarity analysis",
      "Reports and analytics",
    ],
  },
];

export const homeSteps = [
  {
    num: "1",
    title: "Sign in",
    text: "Create your account with your university email. The coordinator sets your role.",
  },
  {
    num: "2",
    title: "Submit a proposal",
    text: "Describe your project, pick a domain and upload supporting documents.",
  },
  {
    num: "3",
    title: "Get a supervisor",
    text: "AI suggests the best-fit supervisor. The coordinator reviews and assigns.",
  },
  {
    num: "4",
    title: "Build and report",
    text: "Track milestones, upload deliverables, receive feedback and present your final defense.",
  },
];

export const homeFAQ = [
  {
    q: "Who can create an account?",
    a: "Any student, supervisor or coordinator with a valid university email address can create an account. The FYP coordinator approves roles and assigns supervisors.",
  },
  {
    q: "Can students see each other's projects?",
    a: "No. Students can only view their own project, milestones, documents and feedback. Supervisors see their assigned students. Coordinators have a department-wide view.",
  },
  {
    q: "Does AI decide the supervisor?",
    a: "AI provides recommendations based on topic similarity and current workload, but the FYP coordinator always makes the final assignment decision.",
  },
  {
    q: "Which files can I upload?",
    a: "You can upload PDF, DOCX and PPTX files up to 25 MB each. All documents are associated with a specific milestone for easy tracking.",
  },
];
