const express = require("express");
const multer = require("multer");
const path = require("path");
const File = require("../models/File");
const Project = require("../models/Project");
const auth = require("../middleware/auth");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload file
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    const { projectId, taskId } = req.body;

    const project = await Project.findById(projectId);
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

    const file = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      project: projectId,
      uploadedBy: req.user._id,
      task: taskId,
    });

    await file.save();

    await file.populate("uploadedBy", "name email");
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get files for project
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

    const files = await File.find({ project: req.params.projectId })
      .populate("uploadedBy", "name email")
      .populate("task", "title")
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete file
router.delete("/:id", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const project = await Project.findById(file.project);
    if (
      !project.owner.equals(req.user._id) &&
      !file.uploadedBy.equals(req.user._id)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete physical file (you might want to use fs.unlink here)
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
