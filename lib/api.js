// lib/api.ts
import axios from "axios";


const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://polexvtu-backend-production.up.railway.app";


if (!BASE) {
throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}


const api = axios.create({
baseURL: BASE,
headers: { "Content-Type": "application/json" },
});


// Attach JWT automatically from localStorage (client-side only)
api.interceptors.request.use((config) => {
if (typeof window !== "undefined") {
const token = localStorage.getItem("token");
if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
}
return config;
});


export default api;