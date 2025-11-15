const express = require("express");
const TimeLog = require("../models/TimeLog");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

// Start time tracking
router.post("/start", auth, async (req, res) => {
  try {
    const { taskId, description } = req.body;

    // Stop any running timers for this user
    await TimeLog.updateMany(
      { user: req.user._id, isRunning: true },
      { isRunning: false, endTime: new Date() }
    );

    const timeLog = new TimeLog({
      task: taskId,
      user: req.user._id,
      startTime: new Date(),
      description,
      isRunning: true,
    });

    await timeLog.save();
    res.status(201).json(timeLog);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Stop time tracking
router.post("/stop", auth, async (req, res) => {
  try {
    const timeLog = await TimeLog.findOne({
      user: req.user._id,
      isRunning: true,
    });

    if (!timeLog) {
      return res.status(404).json({ message: "No active time log found" });
    }

    timeLog.endTime = new Date();
    timeLog.duration = Math.round(
      (timeLog.endTime - timeLog.startTime) / (1000 * 60)
    ); // minutes
    timeLog.isRunning = false;

    await timeLog.save();
    res.json(timeLog);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get time logs for user
router.get("/my-logs", auth, async (req, res) => {
  try {
    const timeLogs = await TimeLog.find({ user: req.user._id })
      .populate("task", "title project")
      .populate("task.project", "name")
      .sort({ startTime: -1 });

    res.json(timeLogs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get time logs for project
router.get("/project/:projectId", auth, async (req, res) => {
  try {
    const timeLogs = await TimeLog.find()
      .populate({
        path: "task",
        match: { project: req.params.projectId },
        populate: { path: "project" },
      })
      .populate("user", "name email")
      .sort({ startTime: -1 });

    const filteredLogs = timeLogs.filter((log) => log.task !== null);
    res.json(filteredLogs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
