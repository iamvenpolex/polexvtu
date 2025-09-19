// app/dashboard/utils/api.ts
import axios, { AxiosRequestConfig } from "axios";

export async function apiFetch<T>(url: string, options: AxiosRequestConfig = {}): Promise<T> {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios({ url, ...options, headers });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("API request failed");
  }
}
