import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

// Async thunks
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (page = 1, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/posts?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch posts" }
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/posts`, postData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create post" }
      );
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { postId, post: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to like post" }
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/comment`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { postId, post: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to add comment" }
      );
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    currentPost: null,
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    addNewPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updatePostInList: (state, action) => {
      const index = state.posts.findIndex(
        (post) => post._id === action.payload._id
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.posts = action.payload.posts;
        } else {
          state.posts = [...state.posts, ...action.payload.posts];
        }
        state.page = action.payload.page;
        state.hasMore = action.payload.page < action.payload.pages;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload); // Add new post to beginning
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload.postId
        );
        if (index !== -1) {
          state.posts[index] = action.payload.post;
        }
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload.postId
        );
        if (index !== -1) {
          state.posts[index] = action.payload.post;
        }
      });
  },
});

export const { clearError, setCurrentPost, addNewPost, updatePostInList } =
  postsSlice.actions;
export default postsSlice.reducer;
