export const API_BASE = "https://localhost:7026"

function getToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  // ❌ error from backend
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }

  // ✅ handle empty responses safely
  if (res.status === 204) {
    return null as T
  }

  const contentType = res.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    return null as T
  }

  return (await res.json()) as T
}
