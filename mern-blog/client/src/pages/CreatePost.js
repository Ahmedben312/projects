import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { postsAPI } from "../services/api";
import { isAuthenticated, getUser } from "../utils/auth"; // ADD THIS IMPORT
import RichTextEditor from "../components/RichTextEditor";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    categories: [],
    featuredImage: "",
  });
  const [categoryInput, setCategoryInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if not authenticated - FIXED VERSION
  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    console.log("User is authenticated, user ID:", getUser()?.id);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContentChange = (content) => {
    console.log("Content changed:", content);
    setFormData((prev) => ({
      ...prev,
      content: content,
    }));
  };

  const handleAddCategory = () => {
    if (
      categoryInput.trim() &&
      !formData.categories.includes(categoryInput.trim())
    ) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryInput.trim()],
      });
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((cat) => cat !== categoryToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    console.log("Submitting post:", formData);

    try {
      const response = await postsAPI.createPost(formData);
      console.log("Post creation response:", response);

      if (response.data.success) {
        setSuccess("Post created successfully!");
        // Reset form
        setFormData({
          title: "",
          excerpt: "",
          content: "",
          categories: [],
          featuredImage: "",
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Post creation error:", error);
      setError(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create New Post
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

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Post Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={2}
            helperText="Brief description of your post (optional)"
          />

          <TextField
            fullWidth
            label="Featured Image URL"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={handleChange}
            margin="normal"
            helperText="Add a featured image URL (optional)"
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Categories
            </Typography>
            <TextField
              fullWidth
              label="Add Category"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={handleAddCategory}>Add</Button>
                  </InputAdornment>
                ),
              }}
              margin="normal"
            />
            <Box sx={{ mt: 1 }}>
              {formData.categories.map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  onDelete={() => handleRemoveCategory(category)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Content
            </Typography>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !formData.title || !formData.content}
            sx={{ mt: 3 }}
          >
            {loading ? "Creating Post..." : "Create Post"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePost;
