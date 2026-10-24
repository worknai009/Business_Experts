const TOKEN_KEY = "be-admin-token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && typeof options.body === "string") headers["Content-Type"] = "application/json";

  const response = await fetch(`/api${path}`, { ...options, headers });
  if (response.status === 401 && !path.startsWith("/auth")) {
    setToken(null);
    window.location.reload();
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError((data as { error?: string }).error || `Request failed (${response.status})`, response.status);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" })
};

export async function uploadFile(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const token = getToken();
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((data as { error?: string }).error || "Upload failed.");
  return (data as { url: string }).url;
}

export type AnyDoc = Record<string, unknown> & { _id: string };
