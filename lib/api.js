import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");

const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
