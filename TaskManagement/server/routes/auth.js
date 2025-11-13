const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password should be at least 6 characters" });
    }

    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new user
    user = new User({ username, password });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    // Create JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || "hello",
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: user.id, username: user.username },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Check if user exists
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || "hello",
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: user.id, username: user.username },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
