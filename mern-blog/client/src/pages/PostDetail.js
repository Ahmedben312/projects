import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  IconButton,
  TextField,
  Button,
  Alert,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { postsAPI } from "../services/api";
import { isAuthenticated, getUser } from "../utils/auth"; // Make sure this is imported

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liking, setLiking] = useState(false);

  const user = getUser();

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPost(id);
      setPost(response.data.post);
    } catch (error) {
      setError("Failed to fetch post");
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated()) {
      alert("Please login to like posts");
      return;
    }

    setLiking(true);
    try {
      const response = await postsAPI.likePost(id);
      setPost((prevPost) => ({
        ...prevPost,
        likes: response.data.liked
          ? [...prevPost.likes, user.id]
          : prevPost.likes.filter((like) => like !== user.id),
      }));
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setLiking(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await postsAPI.addComment(id, comment);
      setPost((prevPost) => ({
        ...prevPost,
        comments: response.data.comments,
      }));
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Post not found"}</Alert>
      </Container>
    );
  }

  const isLiked = post.likes?.includes(user?.id);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            src={post.author?.profilePicture}
            sx={{ width: 40, height: 40, mr: 2 }}
          >
            {post.author?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {post.author?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(post.createdAt)}
            </Typography>
          </Box>
        </Box>

        {post.featuredImage && (
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <img
              src={post.featuredImage}
              alt="Featured"
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                objectFit: "cover",
              }}
            />
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          {post.categories?.map((category, index) => (
            <Chip
              key={index}
              label={category}
              color="primary"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>

        <Box
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
          sx={{
            "& img": { maxWidth: "100%", height: "auto" },
            "& p": { lineHeight: 1.8, mb: 2 },
            "& h1, & h2, & h3": { mt: 3, mb: 2 },
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 4,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <IconButton
            onClick={handleLike}
            disabled={liking}
            color={isLiked ? "error" : "default"}
          >
            {isLiked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {post.likes?.length || 0} likes
          </Typography>
          <Typography variant="body2">
            {post.comments?.length || 0} comments
          </Typography>
        </Box>
      </Paper>

      {/* Comments Section */}
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Comments ({post.comments?.length || 0})
        </Typography>

        {/* Add Comment Form */}
        {isAuthenticated() ? (
          <Box component="form" onSubmit={handleAddComment} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={submittingComment || !comment.trim()}
            >
              {submittingComment ? "Posting..." : "Post Comment"}
            </Button>
          </Box>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please <a href="/login">login</a> to add comments.
          </Alert>
        )}

        {/* Comments List */}
        <Box className="comment-section">
          {post.comments?.length > 0 ? (
            post.comments.map((comment, index) => (
              <Comment key={index} comment={comment} />
            ))
          ) : (
            <Typography color="text.secondary" align="center">
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PostDetail;
