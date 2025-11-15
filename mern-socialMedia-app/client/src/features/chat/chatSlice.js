import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

// Async thunks
export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch conversations" }
      );
    }
  }
);

export const createConversation = createAsyncThunk(
  "chat/createConversation",
  async (conversationData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/chat/conversations`,
        conversationData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create conversation" }
      );
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({ conversationId, page = 1 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/chat/messages/${conversationId}?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { conversationId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch messages" }
      );
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  "chat/markMessagesAsRead",
  async ({ messageIds, conversationId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/chat/messages/read`,
        { messageIds, conversationId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { messageIds, conversationId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to mark messages as read" }
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    currentConversation: null,
    messages: {},
    loading: false,
    error: null,
    onlineUsers: [],
    typingUsers: {},
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
    },
    updateConversationLastMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(
        (c) => c._id === conversationId
      );
      if (conversation) {
        conversation.lastMessage = message;
        // Move conversation to top
        state.conversations = state.conversations.filter(
          (c) => c._id !== conversationId
        );
        state.conversations.unshift(conversation);
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setUserTyping: (state, action) => {
      const { conversationId, userId, username } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      const existingUser = state.typingUsers[conversationId].find(
        (u) => u.userId === userId
      );
      if (!existingUser) {
        state.typingUsers[conversationId].push({ userId, username });
      }
    },
    setUserStopTyping: (state, action) => {
      const { conversationId, userId } = action.payload;
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = state.typingUsers[
          conversationId
        ].filter((u) => u.userId !== userId);
      }
    },
    markMessagesAsReadLocal: (state, action) => {
      const { messageIds, userId } = action.payload;
      Object.keys(state.messages).forEach((conversationId) => {
        state.messages[conversationId] = state.messages[conversationId].map(
          (message) => {
            if (
              messageIds.includes(message._id) &&
              !message.readBy.includes(userId)
            ) {
              return {
                ...message,
                readBy: [...message.readBy, userId],
              };
            }
            return message;
          }
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Conversation
      .addCase(createConversation.fulfilled, (state, action) => {
        const existingIndex = state.conversations.findIndex(
          (c) => c._id === action.payload._id
        );
        if (existingIndex === -1) {
          state.conversations.unshift(action.payload);
        }
      })
      // Fetch Messages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, messages, page } = action.payload;
        if (page === 1) {
          state.messages[conversationId] = messages;
        } else {
          state.messages[conversationId] = [
            ...messages,
            ...state.messages[conversationId],
          ];
        }
      });
  },
});

export const {
  clearError,
  setCurrentConversation,
  addMessage,
  updateConversationLastMessage,
  setOnlineUsers,
  setUserTyping,
  setUserStopTyping,
  markMessagesAsReadLocal,
} = chatSlice.actions;
export default chatSlice.reducer;
