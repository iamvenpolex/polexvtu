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
import axios, { AxiosRequestConfig } from "axios";

// Use environment variable for backend URL
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");
}

const api = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically on every request
api.interceptors.request.use((config: AxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Optional: intercept responses for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Could log errors or customize messages here
    return Promise.reject(error);
  }
);

export default api;
