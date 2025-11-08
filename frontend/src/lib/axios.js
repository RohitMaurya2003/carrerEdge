// frontend/src/lib/axios.js
import axios from "axios";

// Use the backend base URL from VITE_API_URL. In this project we set VITE_API_URL
// to include the "/api" prefix in production (for example: https://carreredge.onrender.com/api).
// Therefore frontend calls should use paths WITHOUT a leading "/api" so the
// final request becomes: `${VITE_API_URL}/auth/check`.
// Example:
//   api.get('/auth/check') // => https://carreredge.onrender.com/api/auth/check
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true,
});

export default api;
