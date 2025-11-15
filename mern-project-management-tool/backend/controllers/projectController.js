const Project = require("../models/Project");

exports.getProjects = async (req, res) => {
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
};

exports.createProject = async (req, res) => {
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
};
