const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const auth = require("../middleware/auth");

const router = express.Router();

// Get tasks for project
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

    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignee", "name email")
      .sort({ position: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create task
router.post("/", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.body.project);
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

    const task = new Task(req.body);
    await task.save();

    await task.populate("assignee", "name email");
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update task
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project._id);
    const hasAccess =
      project.owner.equals(req.user._id) ||
      project.members.some((member) => member.user.equals(req.user._id));

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(task, req.body);
    await task.save();

    await task.populate("assignee", "name email");
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update task positions (for drag and drop)
router.put("/:id/position", auth, async (req, res) => {
  try {
    const { status, position } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    task.position = position;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project._id);
    if (!project.owner.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only project owner can delete tasks" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
