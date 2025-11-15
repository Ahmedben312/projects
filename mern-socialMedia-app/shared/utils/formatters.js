import { getInitials, formatNumber, truncateText } from "./helpers.js";

/**
 * Format user profile data for consistent structure
 */
export const formatUserProfile = (user) => {
  if (!user) return null;

  const profile = {
    id: user._id || user.id,
    username: user.username,
    email: user.email,
    profile: {
      firstName: user.profile?.firstName || "",
      lastName: user.profile?.lastName || "",
      fullName: `${user.profile?.firstName || ""} ${
        user.profile?.lastName || ""
      }`.trim(),
      bio: user.profile?.bio || "",
      avatar: user.profile?.avatar || "",
      coverImage: user.profile?.coverImage || "",
      location: user.profile?.location || "",
      website: user.profile?.website || "",
      birthday: user.profile?.birthday || "",
      gender: user.profile?.gender || "",
      relationshipStatus: user.profile?.relationshipStatus || "",
    },
    followers: user.followers || [],
    following: user.following || [],
    isOnline: user.isOnline || false,
    lastSeen: user.lastSeen || user.createdAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    // Computed properties
    initials: getInitials(user.profile?.firstName, user.profile?.lastName),
    followersCount: user.followers?.length || 0,
    followingCount: user.following?.length || 0,
  };

  return profile;
};

/**
 * Format post data for consistent structure
 */
export const formatPost = (post) => {
  if (!post) return null;

  const formattedPost = {
    id: post._id || post.id,
    author: formatUserProfile(post.author),
    content: post.content || "",
    media: post.media || [],
    likes: post.likes || [],
    comments: (post.comments || []).map((comment) => ({
      id: comment._id || comment.id,
      user: formatUserProfile(comment.user),
      content: comment.content,
      likes: comment.likes || [],
      createdAt: comment.createdAt,
      // Computed properties
      likesCount: comment.likes?.length || 0,
    })),
    shares: post.shares || [],
    isPublic: post.isPublic !== false,
    tags: post.tags || [],
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    // Computed properties
    likesCount: post.likes?.length || 0,
    commentsCount: post.comments?.length || 0,
    sharesCount: post.shares?.length || 0,
    hasMedia: (post.media || []).length > 0,
    mediaTypes: (post.media || []).map((media) => media.type),
  };

  return formattedPost;
};

/**
 * Format message data for consistent structure
 */
export const formatMessage = (message) => {
  if (!message) return null;

  const formattedMessage = {
    id: message._id || message.id,
    conversation: message.conversation,
    sender: formatUserProfile(message.sender),
    content: message.content,
    media: message.media,
    readBy: message.readBy || [],
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    // Computed properties
    isText: !message.media && !!message.content,
    isMedia: !!message.media,
    mediaType: message.media?.type,
    isRead: (readBy, currentUserId) => readBy.includes(currentUserId),
    timestamp: message.createdAt,
  };

  return formattedMessage;
};

/**
 * Format conversation data for consistent structure
 */
export const formatConversation = (conversation) => {
  if (!conversation) return null;

  const formattedConversation = {
    id: conversation._id || conversation.id,
    participants: (conversation.participants || []).map(formatUserProfile),
    lastMessage: formatMessage(conversation.lastMessage),
    isGroup: conversation.isGroup || false,
    groupName: conversation.groupName || "",
    groupAdmin: formatUserProfile(conversation.groupAdmin),
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    // Computed properties
    participantCount: conversation.participants?.length || 0,
    isDirect: !conversation.isGroup,
    otherParticipants: (participants, currentUserId) =>
      participants.filter((p) => p.id !== currentUserId),
    displayName: (conversation, currentUserId) => {
      if (conversation.isGroup) {
        return conversation.groupName || "Group Chat";
      }
      const otherParticipants = conversation.participants?.filter(
        (p) => p.id !== currentUserId
      );
      if (otherParticipants?.length === 1) {
        const user = otherParticipants[0];
        return user.profile.fullName || user.username;
      }
      return "Unknown User";
    },
    avatar: (conversation, currentUserId) => {
      if (conversation.isGroup) {
        return conversation.groupAvatar || "";
      }
      const otherParticipants = conversation.participants?.filter(
        (p) => p.id !== currentUserId
      );
      if (otherParticipants?.length === 1) {
        return otherParticipants[0].profile.avatar;
      }
      return "";
    },
  };

  return formattedConversation;
};

/**
 * Format notification data for consistent structure
 */
export const formatNotification = (notification) => {
  if (!notification) return null;

  const formattedNotification = {
    id: notification._id || notification.id,
    recipient: notification.recipient,
    sender: formatUserProfile(notification.sender),
    type: notification.type,
    post: notification.post ? formatPost(notification.post) : null,
    message: notification.message ? formatMessage(notification.message) : null,
    read: notification.read || false,
    link: notification.link || "",
    createdAt: notification.createdAt,
    // Computed properties
    isUnread: !notification.read,
    timestamp: notification.createdAt,
    message: getNotificationMessage(notification),
    icon: getNotificationIcon(notification.type),
    actionLink: getNotificationLink(notification),
  };

  return formattedNotification;
};

/**
 * Get notification message based on type
 */
const getNotificationMessage = (notification) => {
  const senderName =
    notification.sender?.profile?.fullName ||
    notification.sender?.username ||
    "Someone";

  switch (notification.type) {
    case "like":
      return `${senderName} liked your post`;
    case "comment":
      return `${senderName} commented on your post`;
    case "follow":
      return `${senderName} started following you`;
    case "message":
      return `${senderName} sent you a message`;
    case "share":
      return `${senderName} shared your post`;
    case "mention":
      return `${senderName} mentioned you in a post`;
    case "tag":
      return `${senderName} tagged you in a photo`;
    default:
      return "You have a new notification";
  }
};

/**
 * Get notification icon based on type
 */
const getNotificationIcon = (type) => {
  switch (type) {
    case "like":
      return "❤️";
    case "comment":
      return "💬";
    case "follow":
      return "👤";
    case "message":
      return "✉️";
    case "share":
      return "🔄";
    case "mention":
      return "📍";
    case "tag":
      return "🏷️";
    default:
      return "🔔";
  }
};

/**
 * Get notification link based on type
 */
const getNotificationLink = (notification) => {
  switch (notification.type) {
    case "like":
    case "comment":
    case "share":
    case "mention":
      return notification.post ? `/post/${notification.post.id}` : "/";
    case "follow":
      return `/profile/${notification.sender.id}`;
    case "message":
      return `/chat`;
    case "tag":
      return notification.post ? `/post/${notification.post.id}` : "/";
    default:
      return "/";
  }
};

/**
 * Format search results
 */
export const formatSearchResults = (results) => {
  if (!results) return [];

  return results.map((result) => {
    if (result.type === "user") {
      return {
        ...result,
        data: formatUserProfile(result.data),
      };
    }
    if (result.type === "post") {
      return {
        ...result,
        data: formatPost(result.data),
      };
    }
    return result;
  });
};

/**
 * Format API response for consistent structure
 */
export const formatApiResponse = (data, message = "", success = true) => {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Format error response
 */
export const formatErrorResponse = (message, details = null) => {
  return {
    success: false,
    message,
    details,
    timestamp: new Date().toISOString(),
  };
};
