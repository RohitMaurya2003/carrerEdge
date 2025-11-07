import axios from "axios";

// Use Vite-provided VITE_API_URL when available (trim whitespace).
// Fallback to localhost in development, and to relative /api in production
// when no VITE_API_URL is provided.
const RAW = import.meta.env.VITE_API_URL;
const API_BASE =
  typeof RAW === "string" && RAW.trim().length > 0
    ? RAW.trim()
    : import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "";

export const axiosInstance = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : "/api",
  withCredentials: true,
});
