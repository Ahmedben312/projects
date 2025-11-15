export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
    SEARCH: "/users/search",
    SUGGESTIONS: "/users/suggestions",
    FOLLOW: "/users/:id/follow",
  },
  POSTS: {
    BASE: "/posts",
    LIKE: "/posts/:id/like",
    COMMENT: "/posts/:id/comment",
    USER_POSTS: "/users/:userId/posts",
    FEED: "/posts/feed",
  },
  UPLOAD: {
    BASE: "/upload",
    MULTIPLE: "/upload/multiple",
  },
  CHAT: {
    CONVERSATIONS: "/chat/conversations",
    MESSAGES: "/chat/messages/:conversationId",
    MARK_READ: "/chat/messages/read",
  },
  NOTIFICATIONS: {
    BASE: "/notifications",
    READ: "/notifications/:id/read",
    READ_ALL: "/notifications/read-all",
    UNREAD_COUNT: "/notifications/unread-count",
  },
};
