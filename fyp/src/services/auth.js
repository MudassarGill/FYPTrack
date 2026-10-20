export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost") {
      return "http://localhost:8000/api";
    }
    if (host === "127.0.0.1") {
      return "http://127.0.0.1:8000/api";
    }
  }
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
}

export const API_BASE_URL = getApiBaseUrl();

const TOKEN_KEY = "fypTrack_auth_token";
const USER_KEY = "fypTrack_auth_user";

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredSession(token, user) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to store session in localStorage:", e);
  }
}

export function clearStoredSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error("Failed to clear session:", e);
  }
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    let message = "Request failed. Please try again.";
    if (typeof data.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data.detail) && data.detail.length > 0) {
      message = data.detail.map((d) => d.msg || d.message).join(", ");
    } else if (data.message) {
      message = data.message;
    }
    throw new Error(message);
  }
  return data;
}

async function robustFetch(endpoint, options) {
  const primary = `${getApiBaseUrl()}${endpoint}`;
  const alt = primary.includes("localhost")
    ? primary.replace("localhost", "127.0.0.1")
    : primary.replace("127.0.0.1", "localhost");

  try {
    return await fetch(primary, options);
  } catch (err) {
    try {
      return await fetch(alt, options);
    } catch {
      throw new Error("Unable to connect to backend server. Make sure Python uvicorn is running on port 8000.");
    }
  }
}

export async function signUp({ full_name, email, password, role = "student" }) {
  const response = await robustFetch("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ full_name, email, password, role }),
  });
  const data = await handleResponse(response);
  if (data.access_token && data.user) {
    setStoredSession(data.access_token, data.user);
  }
  return data;
}

export async function logIn({ email, password }) {
  const response = await robustFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(response);
  if (data.access_token && data.user) {
    setStoredSession(data.access_token, data.user);
  }
  return data;
}

export async function getCurrentUser(token) {
  const authToken = token || getStoredToken();
  if (!authToken) throw new Error("No token provided");

  const response = await robustFetch("/auth/me", {
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
  });
  return handleResponse(response);
}

export async function forgotPassword(email) {
  const response = await robustFetch("/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
}

export async function resetPassword({ token, new_password }) {
  const response = await robustFetch("/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ token, new_password }),
  });
  return handleResponse(response);
}
