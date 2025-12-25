import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Build allowed origins - always include localhost in development
const localhostOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((s) => s.trim()).filter(Boolean)
  : [];

// In development (NODE_ENV !== 'production'), always allow localhost
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? envOrigins
    : [...new Set([...localhostOrigins, ...envOrigins])];

// used to store online users
const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // allow requests with no origin (eg. mobile clients, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
  // you can limit transports if needed
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query?.userId || socket.handshake.auth?.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
