export const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4000');

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
  if (!res.ok) {
    const text = await res.text();
    let body = text;
    try { body = JSON.parse(text); } catch (e) {}
    throw new Error(body && body.error ? body.error : `Request failed: ${res.status}`);
  }
  try {
    return await res.json();
  } catch (e) {
    return null;
  }
}
