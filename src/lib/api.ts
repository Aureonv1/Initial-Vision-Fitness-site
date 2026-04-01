import type { SiteData } from '../types/site';

export type ContactPayload = { name: string; email: string; phone: string; message: string };

export type MessageEntry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  at: string;
};

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text || res.statusText);
  }
}

async function getErrorMessage(res: Response, fallback: string) {
  try {
    const data = await parse<{ error?: string }>(res);
    return data.error || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchSite(): Promise<SiteData> {
  const res = await fetch('/api/site');
  if (!res.ok) throw new Error('Failed to load site');
  return parse<SiteData>(res);
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Failed to send');
  }
}

export async function login(password: string): Promise<void> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error(await getErrorMessage(res, 'Login failed'));
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
}

export async function authMe(): Promise<{ admin: boolean }> {
  const res = await fetch('/api/auth/me', { credentials: 'include' });
  if (!res.ok) return { admin: false };
  return parse<{ admin: boolean }>(res);
}

export async function saveSite(data: SiteData): Promise<void> {
  const res = await fetch('/api/site', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await getErrorMessage(res, 'Save failed'));
}

export async function fetchMessages(): Promise<MessageEntry[]> {
  const res = await fetch('/api/messages', { credentials: 'include' });
  if (!res.ok) throw new Error(await getErrorMessage(res, 'Unauthorized'));
  return parse<MessageEntry[]>(res);
}

export async function deleteMessage(id: string): Promise<void> {
  const res = await fetch(`/api/messages/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await getErrorMessage(res, 'Delete failed'));
}
