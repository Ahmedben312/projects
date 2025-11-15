const express = require("express");
const Project = require("../models/Project");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all projects for user
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
    })
      .populate("owner", "name email")
      .populate("members.user", "name email");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create project
router.post("/", auth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      owner: req.user._id,
    });
    await project.save();

    await project.populate("owner", "name email");
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get project by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user has access to project
    const hasAccess =
      project.owner._id.equals(req.user._id) ||
      project.members.some((member) => member.user._id.equals(req.user._id));

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update project
router.put("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.owner.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only project owner can update project" });
    }

    Object.assign(project, req.body);
    await project.save();

    await project
      .populate("owner", "name email")
      .populate("members.user", "name email");
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add member to project
router.post("/:id/members", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.owner.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only project owner can add members" });
    }

    project.members.push(req.body);
    await project.save();

    await project
      .populate("owner", "name email")
      .populate("members.user", "name email");
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
