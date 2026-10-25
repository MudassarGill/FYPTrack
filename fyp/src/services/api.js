import { getStoredToken, getApiBaseUrl } from "./auth";

async function authFetch(url, options = {}) {
  const token = getStoredToken();
  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const primaryBase = getApiBaseUrl();
  const fallbackBase = primaryBase.includes("localhost")
    ? primaryBase.replace("localhost", "127.0.0.1")
    : primaryBase.replace("127.0.0.1", "localhost");

  let response;
  try {
    response = await fetch(`${primaryBase}${url}`, {
      ...options,
      headers,
    });
  } catch (err) {
    try {
      response = await fetch(`${fallbackBase}${url}`, {
        ...options,
        headers,
      });
    } catch {
      throw new Error("Unable to connect to backend server. Make sure Python uvicorn is running on port 8000.");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail || errorData.message || "Request failed.";
    throw new Error(message);
  }

  return response.json();
}

/* ============================================================
   Projects & Proposals API
   ============================================================ */
export async function getMyProjects() {
  return authFetch("/projects/my");
}

export async function getAllProjects() {
  return authFetch("/projects/all");
}

export async function getProjectById(id) {
  return authFetch(`/projects/${id}`);
}

export async function submitProposal(data) {
  return authFetch("/projects/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProject(id, data) {
  return authFetch(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function assignSupervisorToProject(projectId, supervisorId, supervisorName) {
  return authFetch(`/projects/${projectId}/assign-supervisor`, {
    method: "POST",
    body: JSON.stringify({ supervisor_id: supervisorId, supervisor_name: supervisorName }),
  });
}

export async function submitSupervisorDecision(projectId, status, feedback) {
  return authFetch(`/projects/${projectId}/supervisor-decision`, {
    method: "POST",
    body: JSON.stringify({ status, feedback }),
  });
}

export async function submitCoordinatorDecision(projectId, coordinatorStatus, coordinatorNotes) {
  return authFetch(`/projects/${projectId}/coordinator-decision`, {
    method: "POST",
    body: JSON.stringify({
      coordinator_status: coordinatorStatus,
      coordinator_notes: coordinatorNotes,
    }),
  });
}

/* ============================================================
   Feedback & Comments API
   ============================================================ */
export async function getProjectFeedback(projectId) {
  return authFetch(`/feedback/project/${projectId}`);
}

export async function postFeedback(projectId, message, actionType = "comment") {
  return authFetch("/feedback/", {
    method: "POST",
    body: JSON.stringify({ project_id: projectId, message, action_type: actionType }),
  });
}

/* ============================================================
   Documents & Deliverables API
   ============================================================ */
export async function getProjectDocuments(projectId) {
  return authFetch(`/documents/project/${projectId}`);
}

export async function getDocumentsForReview() {
  return authFetch("/documents/review-list");
}

export async function uploadDocumentFile(formData) {
  return authFetch("/documents/upload", {
    method: "POST",
    body: formData,
  });
}

export async function reviewDocumentFile(documentId, status, supervisorComment) {
  return authFetch(`/documents/${documentId}/review`, {
    method: "POST",
    body: JSON.stringify({ status, supervisor_comment: supervisorComment }),
  });
}

export function getDocumentDownloadUrl(documentId) {
  return `${getApiBaseUrl()}/documents/download/${documentId}`;
}

export async function deleteDocument(documentId) {
  return authFetch(`/documents/${documentId}`, {
    method: "DELETE",
  });
}

/* ============================================================
   Evaluations API
   ============================================================ */
export async function getProjectEvaluations(projectId) {
  return authFetch(`/evaluations/project/${projectId}`);
}

export async function submitEvaluationMarks(data) {
  return authFetch("/evaluations/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ============================================================
   Notifications API
   ============================================================ */
export async function getNotifications() {
  return authFetch("/notifications/my");
}

export async function getUnreadNotificationsCount() {
  return authFetch("/notifications/unread-count");
}

export async function markNotificationAsRead(id) {
  return authFetch(`/notifications/read/${id}`, {
    method: "POST",
  });
}

export async function markAllNotificationsAsRead() {
  return authFetch("/notifications/read-all", {
    method: "POST",
  });
}

export async function clearAllNotifications() {
  return authFetch("/notifications/clear-all", {
    method: "DELETE",
  });
}

export async function deleteNotification(id) {
  return authFetch(`/notifications/${id}`, {
    method: "DELETE",
  });
}



/* ============================================================
   Supervisors Allocation API
   ============================================================ */
export async function getSupervisorsList() {
  return authFetch("/supervisors/list");
}

export async function getSupervisorRecommendations(projectId) {
  return authFetch(`/supervisors/recommendations/${projectId}`);
}

/* ============================================================
   Milestones & Academic Calendar API
   ============================================================ */
export async function getMilestones() {
  return authFetch("/milestones/");
}

export async function updateMilestoneDeadline(id, data) {
  return authFetch(`/milestones/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function broadcastMilestonesReminder() {
  return authFetch("/milestones/broadcast", {
    method: "POST",
  });
}

/* ============================================================
   Department Students API
   ============================================================ */
export async function getAllStudents() {
  return authFetch("/students/");
}

export async function getMyStudents() {
  return authFetch("/students/my");
}

/* ============================================================
   AI Similarity & Academic Archive Audits API
   ============================================================ */
export async function getSimilarityAudits() {
  return authFetch("/similarity/audits");
}

export async function checkSimilarity(data) {
  return authFetch("/similarity/check", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getSimilarityBenchmarks() {
  return authFetch("/similarity/benchmarks");
}

/* ============================================================
   Department Policy Settings API
   ============================================================ */
export async function getDepartmentSettings() {
  return authFetch("/settings/");
}

export async function updateDepartmentSettings(data) {
  return authFetch("/settings/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}



