export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

async function postAuthRequest(path, payload) {
  const response = await fetch(`${API_BASE_URL}/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data.detail;
    const message = typeof detail === "string" ? detail : "Please check your details and try again.";
    throw new Error(message);
  }

  return data;
}

export function signUp(payload) {
  return postAuthRequest("signup", payload);
}

export function logIn(payload) {
  return postAuthRequest("login", payload);
}

export async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data.detail;
    const message = typeof detail === "string" ? detail : "Your session could not be verified.";
    throw new Error(message);
  }

  return data;
}

async function authorizedRequest(path, token, options = {}) {
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      typeof data.detail === "string" ? data.detail : "The request could not be completed.",
    );
    error.status = response.status;
    throw error;
  }
  return data;
}

export function getWorkspace(role, token) {
  const routeByRole = {
    student: "student/workspace",
    supervisor: "supervisor/workspace",
    coordinator: "coordinator/workspace",
  };
  const route = routeByRole[role];
  if (!route) throw new Error("This account has an unsupported role.");
  return authorizedRequest(route, token);
}

export function assignSupervisor(token, studentUserId, supervisorUserId) {
  return authorizedRequest("coordinator/assignments", token, {
    method: "POST",
    body: { student_user_id: Number(studentUserId), supervisor_user_id: Number(supervisorUserId) },
  });
}

export function inviteSupervisor(token, payload) {
  return authorizedRequest("coordinator/supervisor-invitations", token, {
    method: "POST",
    body: payload,
  });
}

export function activateInvitation(payload) {
  return postAuthRequest("activate-invitation", payload);
}
