const API_BASE_URL =
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
