import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  requestMentor,
  acceptRequest,
  rejectRequest,
  getConnections,
  removeConnection,
  getPendingRequests,
  getMentors
} from "../controllers/mentor.controller.js";
import { authorizeRoles } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/request/:mentorId", protectRoute,authorizeRoles("mentee"), requestMentor);
router.post("/accept/:menteeId", protectRoute,authorizeRoles("mentor"), acceptRequest);
router.post("/reject/:menteeId", protectRoute,authorizeRoles("mentor"), rejectRequest);
router.get("/connections", protectRoute, getConnections);
router.get("/pending-requests", protectRoute,authorizeRoles("mentor"), getPendingRequests);
router.delete("/remove/:userId", protectRoute, removeConnection);
router.get("/mentors", protectRoute,authorizeRoles("mentee"), getMentors);

export default router;