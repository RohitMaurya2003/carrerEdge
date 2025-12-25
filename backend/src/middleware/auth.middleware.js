import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * protectRoute - Express middleware to protect routes using JWT stored in cookie or Authorization header
 * - Reads token from `req.cookies.jwt` or `Authorization: Bearer <token>` header
 * - Verifies token and attaches the user (without password) to `req.user`
 */
export const protectRoute = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies && req.cookies.jwt;
    const authHeader = req.headers && req.headers.authorization;

    let token = tokenFromCookie;
    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res.status(401).json({ message: "Not authorized" });
  }
};

/**
 * authorizeRoles - returns middleware that checks if the authenticated user has one of the allowed roles
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};