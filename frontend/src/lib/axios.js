import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001").trim().replace(/\/$/, "");

export const axiosInstance = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true, // include cookies
});

export const protectRoute = async (req, res, next) => {
  console.log("protectRoute headers:", req.headers);
  console.log("protectRoute cookies:", req.cookies); // must show jwt cookie
  // ...existing auth logic...
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    secure: process.env.NODE_ENV === "production",
  });
};
