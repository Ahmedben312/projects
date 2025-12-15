import express from "express";
import UserController from "../controllers/UserController";
import { authenticate, authorize } from "../middleware/auth";

const router = express.Router();

// Public routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Protected routes
router.get("/profile", authenticate, UserController.getProfile);
router.put("/profile", authenticate, UserController.updateProfile);

// Admin-only routes
router.post(
  "/staff",
  authenticate,
  authorize(["admin"]),
  UserController.createStaff
);

export default router;
