const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
  likePost,
  addComment,
} = require("../controllers/postController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", auth, createPost);
router.post("/:id/like", auth, likePost);
router.post("/:id/comment", auth, addComment);

module.exports = router;
