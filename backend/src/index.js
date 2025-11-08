import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// Improve diagnostics: log uncaught exceptions and unhandled rejections so nodemon output includes stack traces
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err && err.stack ? err.stack : err);
  // don't exit here; nodemon will restart on file changes — but surface valuable info
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION at:", promise, "reason:", reason && reason.stack ? reason.stack : reason);
});

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import mentorRoutes from "./routes/mentor.route.js";
import connectionRoutes from "./routes/connection.route.js";
import geminiRoutes from "./routes/gemini.route.js";
import paymentRoutes from "./routes/payment.route.js";
import perplexityRoutes from "./routes/perplexity.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Allow larger JSON payloads to support base64 image uploads from the frontend
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Enhanced CORS configuration
// Enhanced CORS configuration
const getCorsOptions = () => {
  // Default origins for development and production
  const defaultOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173", 
    "https://rohitcarreredge.netlify.app",
    "https://carreredge.onrender.com" // Add your Render backend URL
  ];
  
  // Get origins from environment variable or use defaults
  const raw = process.env.FRONTEND_URL || defaultOrigins.join(",");
  const allowedOrigins = raw.split(",").map((s) => s.trim()).filter(Boolean);
  
  console.log("🔄 CORS allowed origins:", allowedOrigins);
  
  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, health checks, etc.)
      if (!origin) {
        console.log("✅ Allowing request with no origin (health check/internal)");
        return callback(null, true);
      }
      
      // In development, be more permissive
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔓 Development mode - Allowing origin: ${origin}`);
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        console.log(`✅ Allowed CORS request from: ${origin}`);
        return callback(null, true);
      } else {
        console.log(`❌ Blocked CORS request from: ${origin}`);
        console.log(`📋 Allowed origins:`, allowedOrigins);
        return callback(new Error(`CORS policy: Origin ${origin} not allowed`), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With', 
      'Cookie', 
      'Set-Cookie',
      'Accept',
      'Origin'
    ],
    exposedHeaders: ["set-cookie"],
    maxAge: 86400 // 24 hours for preflight cache
  };
};

// Apply CORS middleware
const corsOptions = getCorsOptions();
app.use(cors(corsOptions));

// Explicitly handle preflight requests for all routes
app.options("*", cors(corsOptions));

// Enhanced CORS error handler
app.use((err, req, res, next) => {
  if (err && /CORS policy/i.test(err.message)) {
    console.log(`🚫 CORS Error: ${err.message}`);
    return res.status(403).json({ 
      message: err.message,
      details: "Check if your frontend URL is in the allowed origins list",
      allowedOrigins: corsOptions.origin instanceof Function ? "Dynamic check" : corsOptions.origin
    });
  }
  next(err);
});

// Request logging middleware (useful for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No Origin'}`);
  next();
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/mentorship", mentorRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/discover", perplexityRoutes);
app.use("/api/connections", connectionRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Handle SPA routing - serve index.html for all unknown routes
  app.get("*", (req, res, next) => {
    // Don't serve HTML for API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ 
    message: "API endpoint not found",
    path: req.path
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("🔥 Global Error Handler:", error);
  res.status(error.status || 500).json({
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
server.listen(PORT, () => {
  console.log("🚀 Server is running on PORT:", PORT);
  console.log("🌍 Environment:", process.env.NODE_ENV || 'development');
  console.log("📋 Allowed CORS origins:", 
    process.env.FRONTEND_URL || "http://localhost:5173, https://rohitcarreredge.netlify.app"
  );
  connectDB();
});

export default app;