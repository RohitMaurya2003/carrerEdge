import express from "express";
import { summarizeTopic } from "../controllers/perplexity.controller.js";

const router = express.Router();

// Public endpoint for summarizing latest news for a topic
router.post("/summarize", summarizeTopic);

export default router;
