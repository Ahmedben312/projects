const express = require("express");
const Project = require("../models/Project");
const Task = require("../models/Task");
const TimeLog = require("../models/TimeLog");
const auth = require("../middleware/auth");

const router = express.Router();

// Get project analytics
router.get("/project/:projectId", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check access
    const hasAccess =
      project.owner.equals(req.user._id) ||
      project.members.some((member) => member.user.equals(req.user._id));

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Task statistics
    const tasks = await Task.find({ project: req.params.projectId });
    const taskStats = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      review: tasks.filter((t) => t.status === "review").length,
      done: tasks.filter((t) => t.status === "done").length,
    };

    // Time tracking statistics
    const timeLogs = await TimeLog.find().populate({
      path: "task",
      match: { project: req.params.projectId },
    });

    const projectTimeLogs = timeLogs.filter((log) => log.task !== null);
    const totalTime = projectTimeLogs.reduce(
      (sum, log) => sum + log.duration,
      0
    );

    // Member activity
    const memberActivity = await TimeLog.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "task",
          foreignField: "_id",
          as: "task",
        },
      },
      {
        $unwind: "$task",
      },
      {
        $match: {
          "task.project": project._id,
        },
      },
      {
        $group: {
          _id: "$user",
          totalTime: { $sum: "$duration" },
          taskCount: { $addToSet: "$task" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          user: { name: 1, email: 1 },
          totalTime: 1,
          taskCount: { $size: "$taskCount" },
        },
      },
    ]);

    res.json({
      taskStats,
      totalTime,
      memberActivity,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
