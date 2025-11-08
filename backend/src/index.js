// Single clean backend bootstrap for mentor-match backend
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import mentorRoutes from "./routes/mentor.route.js";
import connectionRoutes from "./routes/connection.route.js";
import geminiRoutes from "./routes/gemini.route.js";
import paymentRoutes from "./routes/payment.route.js";
import perplexityRoutes from "./routes/perplexity.route.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const allowedOrigins = [
  process.env.FRONTEND_URL || "https://rohitcarreredge.netlify.app",
  "https://carreredge.onrender.com",
].filter(Boolean);

// Simpler CORS config: let the library match against an explicit origin list.
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Cookie",
    "Accept",
    "Origin"
  ],
  exposedHeaders: ["set-cookie"],
};

app.use((req, res, next) => {
  // Manual early handling for OPTIONS to guarantee headers in edge cases
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cookie, Accept, Origin');
    return res.sendStatus(204);
  }
  next();
});

app.use(cors(corsOptions));

// Allow larger payloads (images, base64 uploads from frontend)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Simple request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No Origin'}`);
  next();
});

// Health
app.get("/api/health", (req, res) => res.status(200).json({ status: "OK", env: process.env.NODE_ENV || 'development' }));

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/mentorship", mentorRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/discover", perplexityRoutes);
app.use("/api/connections", connectionRoutes);

// Serve static frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => res.sendFile(path.join(__dirname, "../frontend/dist/index.html")));
}

// 404 for unknown API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found', path: req.path });
  }
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err && err.stack ? err.stack : err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  console.log("Allowed CORS origins:", allowedOrigins);
  connectDB();
});

export default app;