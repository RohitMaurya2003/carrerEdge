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

// Define trusted origins - include Netlify, Vercel, and local development
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://rohitcarreredge.netlify.app",
  "https://carreredge.onrender.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
].filter(Boolean);

// Also allow all Vercel preview deployments
const vercelPattern = /https:\/\/carrer-edge.*\.vercel\.app$/;

// CORS configuration with origin checking
const corsOptions = {
  origin: function(origin, callback) {
    // Allow server-to-server requests (no origin)
    if (!origin) {
      return callback(null, true);
    }

    // Check against allowed origins and Vercel pattern
    if (allowedOrigins.includes(origin) || vercelPattern.test(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked CORS origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization", 
    "X-Requested-With",
    "Cookie",
    "Accept",
    "Origin"
  ],
  exposedHeaders: ["Set-Cookie"],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  
  // Set CORS headers for allowed origins
  if (origin && (allowedOrigins.includes(origin) || vercelPattern.test(origin))) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Cookie, Accept, Origin");
    res.header("Access-Control-Expose-Headers", "Set-Cookie");
  }
  
  res.status(204).end();
});

// Allow larger payloads (images, base64 uploads from frontend)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Simple request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || "No Origin"}`);
  next();
});

// Health
app.get("/api/health", (req, res) => res.status(200).json({
  status: "OK",
  env: process.env.NODE_ENV || "development",
  corsOrigins: [...allowedOrigins, "(and all https://*.vercel.app deployments)"]
}));

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
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "API endpoint not found", path: req.path });
  }
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err && err.stack ? err.stack : err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  console.log("Allowed CORS origins:", [
    ...allowedOrigins,
    "(and all https://*.vercel.app deployments)"
  ]);
  connectDB();
});

export default app;