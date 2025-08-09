export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined | null>): string {
  const url = new URL(path.startsWith('http') ? path : `${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

function getAuthHeader(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string, params?: Record<string, string | number | boolean | undefined | null>): Promise<T> {
  const res = await fetch(buildUrl(path, params), {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      ...getAuthHeader(),
    },
  });
  if (!res.ok) throw new Error(`GET ${path} failed with status ${res.status}`);
  return (await res.json()) as T;
}

export async function apiPutForm<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: 'PUT',
    credentials: 'include',
    headers: {
      ...getAuthHeader(),
      // Do not set Content-Type for FormData; browser will set proper boundary
    },
    body: formData,
  });
  if (!res.ok) throw new Error(`PUT ${path} failed with status ${res.status}`);
  return (await res.json()) as T;
}
