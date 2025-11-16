import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// @desc    Update lesson progress
// @route   PUT /api/progress/:enrollmentId/lesson
// @access  Private
export const updateLessonProgress = async (req, res) => {
  try {
    const { lessonId, timeSpent, completed } = req.body;

    const enrollment = await Enrollment.findById(req.params.enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Check if user owns the enrollment
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Update time spent
    enrollment.totalTimeSpent += timeSpent || 0;
    enrollment.lastAccessed = new Date();

    // Mark lesson as completed if needed
    if (completed) {
      const alreadyCompleted = enrollment.completedLessons.find(
        (lesson) => lesson.lesson.toString() === lessonId
      );

      if (!alreadyCompleted) {
        enrollment.completedLessons.push({
          lesson: lessonId,
          timeSpent: timeSpent || 0,
        });
      }
    }

    // Calculate progress percentage
    const course = await Course.findById(enrollment.course);
    const totalLessons = course.lessons.length;
    const completedLessons = enrollment.completedLessons.length;
    enrollment.progress = Math.round((completedLessons / totalLessons) * 100);

    // Mark course as completed if all lessons are done
    if (completedLessons === totalLessons && totalLessons > 0) {
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user enrollments with progress
// @route   GET /api/progress/my-courses
// @access  Private
export const getMyCoursesProgress = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: "course",
        select: "title thumbnail instructor totalHours level",
        populate: {
          path: "instructor",
          select: "name",
        },
      })
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/progress/analytics
// @access  Private (Instructor/Admin)
export const getAnalytics = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });
    const courseIds = courses.map((course) => course._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate("student", "name email")
      .populate("course", "title");

    // Calculate analytics
    const totalStudents = enrollments.length;
    const completedCourses = enrollments.filter((e) => e.completedAt).length;
    const averageProgress =
      enrollments.reduce((acc, curr) => acc + curr.progress, 0) /
        totalStudents || 0;

    // Course-wise analytics
    const courseAnalytics = courses.map((course) => {
      const courseEnrollments = enrollments.filter(
        (e) => e.course._id.toString() === course._id.toString()
      );
      const courseCompleted = courseEnrollments.filter(
        (e) => e.completedAt
      ).length;

      return {
        courseId: course._id,
        courseTitle: course.title,
        totalEnrollments: courseEnrollments.length,
        completedEnrollments: courseCompleted,
        completionRate:
          courseEnrollments.length > 0
            ? (courseCompleted / courseEnrollments.length) * 100
            : 0,
      };
    });

    res.json({
      success: true,
      data: {
        totalStudents,
        completedCourses,
        averageProgress: Math.round(averageProgress),
        courseAnalytics,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
