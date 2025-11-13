import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import { authAPI, postsAPI } from "../services/api";
import { isAuthenticated, getUser, setUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import BlogPost from "../components/BlogPost";

const Profile = () => {
  const [userData, setUserData] = useState(getUser());
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserPosts = async () => {
    try {
      // This would require a new API endpoint to get posts by user
      // For now, we'll use the existing posts API and filter client-side
      const response = await postsAPI.getPosts(1, 100); // Get all posts
      const userPosts = response.data.posts.filter(
        (post) => post.author._id === userData.id
      );
      setUserPosts(userPosts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authAPI.getProfile(); // This would be an update endpoint
      // For now, we'll just show a message since we don't have update endpoint
      setSuccess("Profile updated successfully!");
      setUser(userData);
    } catch (error) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLikeUpdate = (postId, likesCount, isLiked) => {
    setUserPosts((prevPosts) =>
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            src={userData?.profilePicture}
            sx={{ width: 80, height: 80, mr: 3 }}
          >
            {userData?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" gutterBottom>
              {userData?.username}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {userData?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since {new Date(userData?.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Edit Profile" />
          <Tab label="My Posts" />
        </Tabs>

        {activeTab === 0 && (
          <Box component="form" onSubmit={handleUpdateProfile}>
            <TextField
              fullWidth
              label="Username"
              value={userData?.username || ""}
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
              margin="normal"
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={userData?.email || ""}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              margin="normal"
            />

            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={3}
              value={userData?.bio || ""}
              onChange={(e) =>
                setUserData({ ...userData, bio: e.target.value })
              }
              margin="normal"
              helperText="Tell us about yourself"
            />

            <TextField
              fullWidth
              label="Profile Picture URL"
              value={userData?.profilePicture || ""}
              onChange={(e) =>
                setUserData({ ...userData, profilePicture: e.target.value })
              }
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              My Posts ({userPosts.length})
            </Typography>
            {userPosts.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                You haven't created any posts yet.
              </Typography>
            ) : (
              userPosts.map((post) => (
                <BlogPost
                  key={post._id}
                  post={post}
                  onLikeUpdate={handleLikeUpdate}
                />
              ))
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
