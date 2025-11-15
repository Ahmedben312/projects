export const SOCKET_EVENTS = {
  // Connection events
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  // User events
  USER_ONLINE: "user_online",
  USER_OFFLINE: "user_offline",
  USER_TYPING: "user_typing",
  USER_STOP_TYPING: "user_stop_typing",

  // Chat events
  JOIN_CHAT: "join_chat",
  LEAVE_CHAT: "leave_chat",
  JOIN_CONVERSATION: "join_conversation",
  LEAVE_CONVERSATION: "leave_conversation",
  SEND_MESSAGE: "send_message",
  NEW_MESSAGE: "new_message",
  MESSAGE_DELIVERED: "message_delivered",
  MESSAGE_READ: "message_read",
  TYPING_START: "typing_start",
  TYPING_STOP: "typing_stop",

  // Notification events
  JOIN_NOTIFICATIONS: "join_notifications",
  NEW_NOTIFICATION: "new_notification",
  NOTIFICATION_READ: "notification_read",

  // Post events
  NEW_POST: "new_post",
  POST_LIKED: "post_liked",
  POST_COMMENTED: "post_commented",
  POST_SHARED: "post_shared",

  // Error events
  ERROR: "error",
  CHAT_ERROR: "chat_error",
  NOTIFICATION_ERROR: "notification_error",
};

export const SOCKET_ROOMS = {
  USER: (userId) => `user:${userId}`,
  CONVERSATION: (conversationId) => `conversation:${conversationId}`,
  NOTIFICATIONS: (userId) => `notifications:${userId}`,
};
