// frontend/src/lib/axios.js
import axios from "axios";

// Use the raw backend origin as the baseURL. Do NOT include the "/api" prefix here.
// All calls should include the "/api/..." prefix in the request path, e.g.:
// api.get('/api/auth/check')
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
  withCredentials: true,
});

export default api;
