import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
} from "@mui/material";
import { Favorite, FavoriteBorder, Comment } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { postsAPI } from "../services/api";
import { isAuthenticated } from "../utils/auth"; // Make sure this is imported

const BlogPost = ({ post, onLikeUpdate }) => {
  const handleLike = async () => {
    if (!isAuthenticated()) {
      alert("Please login to like posts");
      return;
    }

    try {
      const response = await postsAPI.likePost(post._id);
      if (onLikeUpdate) {
        onLikeUpdate(post._id, response.data.likes, response.data.liked);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const excerpt =
    post.excerpt || stripHtml(post.content).substring(0, 200) + "...";

  return (
    <Card
      sx={{ mb: 3, transition: "all 0.3s ease", "&:hover": { boxShadow: 6 } }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={post.author?.profilePicture}
            sx={{ width: 32, height: 32, mr: 1 }}
          >
            {post.author?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            By {post.author?.username} • {formatDate(post.createdAt)}
          </Typography>
        </Box>

        <Typography
          component={Link}
          to={`/post/${post._id}`}
          variant="h5"
          sx={{
            textDecoration: "none",
            color: "inherit",
            "&:hover": { color: "primary.main" },
            display: "block",
            mb: 2,
          }}
        >
          {post.title}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 2, lineHeight: 1.6 }}
        >
          {excerpt}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {post.categories?.map((category, index) => (
              <Chip
                key={index}
                label={category}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={handleLike}
              color={
                post.likes?.includes?.(localStorage.getItem("userId"))
                  ? "error"
                  : "default"
              }
              className="like-button"
            >
              {post.likes?.includes?.(localStorage.getItem("userId")) ? (
                <Favorite />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>
            <Typography variant="body2">{post.likes?.length || 0}</Typography>

            <Comment sx={{ ml: 1, color: "text.secondary" }} />
            <Typography variant="body2">
              {post.comments?.length || 0}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogPost;
