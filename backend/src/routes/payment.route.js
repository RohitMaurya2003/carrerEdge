import express from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validateCreateOrder, validateVerifyPayment } from "../middleware/validation.middleware.js";

const router = express.Router();

// Create order (protected) - frontend will call this to get an order id
router.post("/create-order", protectRoute, validateCreateOrder, createOrder);

// Verify payment after checkout (protected)
router.post("/verify", protectRoute, validateVerifyPayment, verifyPayment);

export default router;
