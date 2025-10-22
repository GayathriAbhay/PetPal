export const API_BASE = (typeof window !== 'undefined' ? window.location.origin : import.meta.env.VITE_API_URL || 'http://localhost:4000');

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
  if (!res.ok) {
    const text = await res.text();
    let body = text;
    try { body = JSON.parse(text); } catch (e) {}
    throw new Error(typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string' ? body.error : `Request failed: ${res.status}`);
  }
  try {
    return await res.json();
  } catch (e) {
    return null;
  }
}
