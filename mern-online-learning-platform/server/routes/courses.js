import express from "express";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  enrollCourse,
  getInstructorCourses,
} from "../controllers/courseController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(getCourses)
  .post(protect, authorize("instructor", "admin"), createCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("instructor", "admin"), updateCourse);

router.post("/:id/enroll", protect, enrollCourse);

// Add instructor courses route
router.get("/", protect, authorize("instructor", "admin"), (req, res, next) => {
  if (req.query.instructor === "true") {
    return getInstructorCourses(req, res, next);
  }
  next();
});

export default router;
