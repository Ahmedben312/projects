const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// @route   GET /api/users/search
// @desc    Search users
router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res
        .status(400)
        .json({ message: "Search query must be at least 2 characters" });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { "profile.firstName": { $regex: q, $options: "i" } },
        { "profile.lastName": { $regex: q, $options: "i" } },
      ],
      _id: { $ne: req.user.id }, // Exclude current user
    })
      .select("username profile isOnline lastSeen followers following")
      .limit(20);

    // Format response with additional info
    const formattedUsers = users.map((user) => ({
      _id: user._id,
      username: user.username,
      profile: user.profile,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      isFollowing: user.followers.includes(req.user.id),
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
