// frontend/src/lib/axios.js
import axios from "axios";

const base = import.meta.env.VITE_API_URL || "http://localhost:5001";
const api = axios.create({
  // ensure we target backend /api routes
  baseURL: base.endsWith("/") ? base + "api" : base + "/api",
  withCredentials: true,
});

export default api;
