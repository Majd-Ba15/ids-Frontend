"use client";

export type JwtUser = {
  id: number | null;
  role: string | null;
};

function base64UrlDecode(str: string) {
  // base64url -> base64
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4;
  if (pad) str += "=".repeat(4 - pad);
  return atob(str);
}

export function getUserFromToken(): JwtUser {
  if (typeof window === "undefined") return { id: null, role: null };

  const token = localStorage.getItem("token");
  if (!token) return { id: null, role: null };

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(base64UrlDecode(payload));

    // you said claim name is "id"
    const id = decoded?.id ? Number(decoded.id) : null;

    // role claim might be "role" or Microsoft default
    const role =
      decoded?.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      null;

    return { id, role };
  } catch {
    return { id: null, role: null };
  }
}

export function logout() {
  localStorage.removeItem("token");
}
