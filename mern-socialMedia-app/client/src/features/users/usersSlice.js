import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

// Async thunks
export const searchUsers = createAsyncThunk(
  "users/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Search failed" }
      );
    }
  }
);

export const followUser = createAsyncThunk(
  "users/followUser",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/users/${userId}/follow`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to follow user" }
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    searchResults: [],
    searchLoading: false,
    searchError: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    },
    clearSearchError: (state) => {
      state.searchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
        state.searchResults = [];
      })
      // Follow User
      .addCase(followUser.fulfilled, (state, action) => {
        const { userId, isFollowing } = action.payload;
        const user = state.searchResults.find((u) => u._id === userId);
        if (user) {
          user.isFollowing = isFollowing;
          user.followersCount = isFollowing
            ? user.followersCount + 1
            : user.followersCount - 1;
        }
      });
  },
});

export const { clearSearchResults, clearSearchError } = usersSlice.actions;
export default usersSlice.reducer;
