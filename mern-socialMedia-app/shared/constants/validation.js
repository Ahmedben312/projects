export const VALIDATION_RULES = {
  USER: {
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 30,
      PATTERN: /^[a-zA-Z0-9_]+$/,
      PATTERN_MESSAGE:
        "Username can only contain letters, numbers, and underscores",
    },
    PASSWORD: {
      MIN_LENGTH: 6,
      MAX_LENGTH: 128,
      PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      PATTERN_MESSAGE:
        "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    },
    EMAIL: {
      MAX_LENGTH: 254,
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      PATTERN_MESSAGE: "Please enter a valid email address",
    },
    NAME: {
      FIRST_NAME_MAX_LENGTH: 50,
      LAST_NAME_MAX_LENGTH: 50,
      BIO_MAX_LENGTH: 500,
    },
  },
  POST: {
    CONTENT: {
      MAX_LENGTH: 1000,
      MIN_LENGTH: 1,
    },
    COMMENT: {
      MAX_LENGTH: 500,
      MIN_LENGTH: 1,
    },
    TAGS: {
      MAX_COUNT: 10,
      MAX_LENGTH: 20,
    },
  },
  CHAT: {
    MESSAGE: {
      MAX_LENGTH: 2000,
      MIN_LENGTH: 1,
    },
    CONVERSATION: {
      MAX_PARTICIPANTS: 50,
      GROUP_NAME_MAX_LENGTH: 100,
    },
  },
  FILE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ],
    ALLOWED_VIDEO_TYPES: [
      "video/mp4",
      "video/mpeg",
      "video/ogg",
      "video/webm",
      "video/quicktime",
    ],
    ALLOWED_DOCUMENT_TYPES: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/rtf",
    ],
    MAX_FILES_PER_UPLOAD: 10,
  },
  SEARCH: {
    QUERY: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 100,
    },
  },
};

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_USERNAME:
    "Username can only contain letters, numbers, and underscores",
  USERNAME_TOO_SHORT: `Username must be at least ${VALIDATION_RULES.USER.USERNAME.MIN_LENGTH} characters`,
  USERNAME_TOO_LONG: `Username cannot exceed ${VALIDATION_RULES.USER.USERNAME.MAX_LENGTH} characters`,
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.USER.PASSWORD.MIN_LENGTH} characters`,
  PASSWORD_PATTERN: VALIDATION_RULES.USER.PASSWORD.PATTERN_MESSAGE,
  POST_CONTENT_TOO_LONG: `Post content cannot exceed ${VALIDATION_RULES.POST.CONTENT.MAX_LENGTH} characters`,
  COMMENT_TOO_LONG: `Comment cannot exceed ${VALIDATION_RULES.POST.COMMENT.MAX_LENGTH} characters`,
  MESSAGE_TOO_LONG: `Message cannot exceed ${VALIDATION_RULES.CHAT.MESSAGE.MAX_LENGTH} characters`,
  FILE_TOO_LARGE: "File size exceeds the maximum allowed size",
  FILE_TYPE_NOT_ALLOWED: "File type is not allowed",
  SEARCH_QUERY_TOO_SHORT: `Search query must be at least ${VALIDATION_RULES.SEARCH.QUERY.MIN_LENGTH} characters`,
};
