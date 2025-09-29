import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = (Constants?.expoConfig?.extra?.apiBaseUrl) || 'http://localhost:3000';

const buildUrl = (path) => {
  if (!path) return baseUrl;
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export async function apiGet(path) {
  const res = await fetch(buildUrl(path));
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(buildUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(buildUrl(path), { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(buildUrl(path), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return res.json();
}

async function buildAuthHeaders(extra = {}) {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function apiAuthGet(path) {
  const res = await fetch(buildUrl(path), { headers: await buildAuthHeaders() });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiAuthPost(path, body) {
  const res = await fetch(buildUrl(path), {
    method: 'POST',
    headers: await buildAuthHeaders(),
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiAuthPut(path, body) {
  const res = await fetch(buildUrl(path), {
    method: 'PUT',
    headers: await buildAuthHeaders(),
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiAuthDelete(path) {
  const res = await fetch(buildUrl(path), {
    method: 'DELETE',
    headers: await buildAuthHeaders(),
  });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
  return res.json();
}

export default { apiGet, apiPost, apiDelete, apiPut, apiAuthGet, apiAuthPost, apiAuthPut, apiAuthDelete };