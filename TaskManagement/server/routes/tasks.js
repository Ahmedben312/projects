const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Get all tasks for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ msg: "Title is required" });
    }

    const task = new Task({
      title,
      description,
      status: status || "todo",
      dueDate,
      userId: req.user.id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Update task
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    let task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Update fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
