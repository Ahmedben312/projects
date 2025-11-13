import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { postsAPI } from "../services/api";
import BlogPost from "../components/BlogPost";
import Pagination from "../components/Pagination";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  });

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts(page);
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (error) {
      setError("Failed to fetch posts");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLikeUpdate = (postId, likesCount, isLiked) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: isLiked
                ? [...post.likes, localStorage.getItem("userId")]
                : post.likes.filter(
                    (like) => like !== localStorage.getItem("userId")
                  ),
            }
          : post
      )
    );
  };

  const handlePageChange = (newPage) => {
    fetchPosts(newPage);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Latest Blog Posts
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        {posts.length === 0 ? (
          <Typography variant="h6" align="center" color="text.secondary">
            No posts found. Be the first to create one!
          </Typography>
        ) : (
          posts.map((post) => (
            <BlogPost
              key={post._id}
              post={post}
              onLikeUpdate={handleLikeUpdate}
            />
          ))
        )}
      </Box>

      <Pagination
        current={pagination.current}
        total={pagination.pages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default Home;
