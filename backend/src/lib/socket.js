import { Server } from "socket.io";
import http from "http";
import express from "express";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://rohitcarreredge.netlify.app",
      "https://carreredge.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("🟢 New socket connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});
