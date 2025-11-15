const express = require("express");
const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");
const redisClient = require("../redis");

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts with pagination
router.get("/", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isPublic: true })
      .populate("author", "username profile avatar")
      .populate("comments.user", "username profile avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ isPublic: true });

    res.json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/posts
// @desc    Create a post
router.post(
  "/",
  [
    auth,
    body("content")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Content must be less than 1000 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content, media = [], isPublic = true, tags = [] } = req.body;

      // Check if at least content or media is provided
      if (!content && (!media || media.length === 0)) {
        return res.status(400).json({
          message: "Post must contain either content or media",
        });
      }

      const post = new Post({
        author: req.user.id,
        content: content || "",
        media: media,
        isPublic: isPublic,
        tags: tags,
      });

      await post.save();

      // Populate author information before sending response
      await post.populate("author", "username profile avatar");

      // Clear cache if using Redis
      if (redisClient.isOpen) {
        const keys = await redisClient.keys("posts:*");
        if (keys.length > 0) {
          await redisClient.del(keys);
        }
      }

      console.log("Post created successfully:", post._id);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res
        .status(500)
        .json({ message: "Failed to create post", error: error.message });
    }
  }
);

// @route   PUT /api/posts/:id/like
// @desc    Like/unlike a post
router.put("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter((like) => like.toString() !== req.user.id);
    } else {
      // Like
      post.likes.push(req.user.id);
    }

    await post.save();
    await post.populate("author", "username profile avatar");

    res.json(post);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add comment to post
router.post(
  "/:id/comment",
  [
    auth,
    body("content")
      .isLength({ min: 1, max: 500 })
      .withMessage("Comment must be between 1 and 500 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = {
        user: req.user.id,
        content: req.body.content,
      };

      post.comments.push(comment);
      await post.save();

      // Populate the new comment
      await post.populate("comments.user", "username profile avatar");
      await post.populate("author", "username profile avatar");

      res.json(post);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
