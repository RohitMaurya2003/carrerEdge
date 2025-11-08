import { io } from "socket.io-client";

const SOCKET_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001").trim().replace(/\/$/, "");
export const socket = io(SOCKET_BASE, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: true,
});