import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001").trim().replace(/\/$/, "");

export const axiosInstance = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true, // include cookies
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Backend might be down');
    }
    return Promise.reject(error);
  }
);