import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await getSession();
  return {
    Authorization: `Bearer ${session?.accessToken ?? ""}`,
  };
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
  if (!res.ok) throw new Error("GET request failed");
  return res.json();
}

export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("POST request failed");
  return res.json();
}

export async function apiPut<T>(endpoint: string, data: any): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("PUT request failed");
  return res.json();
}

export async function apiDelete(endpoint: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE_URL}${endpoint}`, { method: "DELETE", headers });
  if (!res.ok) throw new Error("DELETE request failed");
}
