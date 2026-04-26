const normalizeApiBase = (value?: string) => {
  const raw = String(value || "").trim();
  if (!raw) {
    // In production, avoid silently targeting localhost.
    return import.meta.env.DEV ? "http://localhost:5000/api" : "/api";
  }
  const noTrailingSlash = raw.replace(/\/+$/, "");
  return noTrailingSlash.endsWith("/api") ? noTrailingSlash : `${noTrailingSlash}/api`;
};

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);

const getToken = () => localStorage.getItem("token");

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error("Unable to connect to server. Check frontend VITE_API_BASE_URL and backend deployment status.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}
