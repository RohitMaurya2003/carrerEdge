import express from "express";
import { generateContent, saveChat, resumeReview, resumeReviewUpload, getActivities } from "../controllers/gemini.controller.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public proxy route for Gemini. Accepts { text, model }
router.post("/generate", generateContent);

// Save chat (requires authentication)
router.post("/save", protectRoute, saveChat);

// Resume review (requires authentication)
router.post("/resume-review", protectRoute, resumeReview);
// Upload resume (PDF/DOCX) -> extract text server-side and review
router.post("/resume-review-upload", protectRoute, upload.single("file"), resumeReviewUpload);

// Activities: recent user events (chat, resume_review, session, etc.)
router.get("/activities", protectRoute, getActivities);

export default router;
