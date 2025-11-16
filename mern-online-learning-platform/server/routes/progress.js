import express from "express";
import {
  updateLessonProgress,
  getMyCoursesProgress,
  getAnalytics,
} from "../controllers/progressController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.put("/:enrollmentId/lesson", protect, updateLessonProgress);
router.get("/my-courses", protect, getMyCoursesProgress);
router.get(
  "/analytics",
  protect,
  authorize("instructor", "admin"),
  getAnalytics
);

export default router;
