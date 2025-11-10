// backend/src/lib/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

export const app = express();
export const server = http.createServer(app);

// ✅ Socket.io CORS Configuration
export const io = new Server(server, {
  cors: {
    origin: [
      "https://rohitcarreredge.netlify.app",
      "https://carreredge.onrender.com",
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// mapping of userId -> socketId
const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // try to read userId from query (client sends it for identification)
  const userId = socket.handshake.query?.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // broadcast online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    // remove socket mapping for this socket
    if (userId && userSocketMap[userId]) delete userSocketMap[userId];
    console.log("🔴 Socket disconnected:", socket.id);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
