const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

async function request(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API_BASE + path, { ...opts, headers });
  if (res.ok) {
    return res.json().catch(() => ({}));
  } else {
    const txt = await res.text();
    throw new Error(txt || res.statusText);
  }
}

export async function login(email, password) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}
export async function getNotes() { return request('/notes'); }
export async function createNote(payload) { return request('/notes', { method: 'POST', body: JSON.stringify(payload) }); }
export async function deleteNote(id) { return request(`/notes/${id}`, { method: 'DELETE' }); }
export async function upgradeTenant(slug) { return request(`/tenants/${slug}/upgrade`, { method: 'POST' }); }
