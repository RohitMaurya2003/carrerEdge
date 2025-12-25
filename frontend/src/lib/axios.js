// frontend/src/lib/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor to handle CORS errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error") {
      console.error("CORS or Network Error:", error);
    }
    return Promise.reject(error);
  }
);

export default api;
