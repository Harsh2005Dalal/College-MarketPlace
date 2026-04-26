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
const DEBUG_LOGS = String(import.meta.env.VITE_DEBUG_LOGS || "true") === "true";

const newRequestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

const log = (message: string, payload?: unknown) => {
  if (!DEBUG_LOGS) return;
  const ts = new Date().toISOString();
  if (payload === undefined) {
    console.log(`[API][${ts}] ${message}`);
    return;
  }
  console.log(`[API][${ts}] ${message}`, payload);
};

export async function apiFetch(path: string, options: RequestInit = {}) {
  const requestId = newRequestId();
  const method = options.method || "GET";
  const url = `${API_BASE}${path}`;
  const startedAt = performance.now();

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  headers.set("X-Request-Id", requestId);

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  log("REQUEST_START", {
    requestId,
    method,
    url,
    hasAuthToken: Boolean(token),
    body: typeof options.body === "string" ? options.body : undefined,
  });

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (error) {
    log("REQUEST_NETWORK_ERROR", {
      requestId,
      method,
      url,
      durationMs: Math.round(performance.now() - startedAt),
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error("Unable to connect to server. Check frontend VITE_API_BASE_URL and backend deployment status.");
  }
  const data = await response.json().catch(() => ({}));
  const durationMs = Math.round(performance.now() - startedAt);

  log("REQUEST_END", {
    requestId,
    method,
    url,
    status: response.status,
    ok: response.ok,
    durationMs,
    response: data,
  });

  if (!response.ok) {
    const errMessage = data.message || "Request failed";
    log("REQUEST_APP_ERROR", { requestId, method, url, status: response.status, message: errMessage });
    throw new Error(errMessage);
  }
  return data;
}
