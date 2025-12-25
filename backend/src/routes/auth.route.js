import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validateSignup, validateLogin, validateUpdateProfile } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, validateUpdateProfile, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
