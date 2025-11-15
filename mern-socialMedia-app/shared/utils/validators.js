import {
  VALIDATION_RULES,
  VALIDATION_MESSAGES,
} from "../constants/validation.js";

/**
 * Validate email address
 */
export const validateEmail = (email) => {
  if (!email) return VALIDATION_MESSAGES.REQUIRED;

  const emailRegex = VALIDATION_RULES.USER.EMAIL.PATTERN;
  if (!emailRegex.test(email)) {
    return VALIDATION_MESSAGES.INVALID_EMAIL;
  }

  if (email.length > VALIDATION_RULES.USER.EMAIL.MAX_LENGTH) {
    return `Email cannot exceed ${VALIDATION_RULES.USER.EMAIL.MAX_LENGTH} characters`;
  }

  return "";
};

/**
 * Validate username
 */
export const validateUsername = (username) => {
  if (!username) return VALIDATION_MESSAGES.REQUIRED;

  if (username.length < VALIDATION_RULES.USER.USERNAME.MIN_LENGTH) {
    return VALIDATION_MESSAGES.USERNAME_TOO_SHORT;
  }

  if (username.length > VALIDATION_RULES.USER.USERNAME.MAX_LENGTH) {
    return VALIDATION_MESSAGES.USERNAME_TOO_LONG;
  }

  const usernameRegex = VALIDATION_RULES.USER.USERNAME.PATTERN;
  if (!usernameRegex.test(username)) {
    return VALIDATION_MESSAGES.INVALID_USERNAME;
  }

  return "";
};

/**
 * Validate password
 */
export const validatePassword = (password) => {
  if (!password) return VALIDATION_MESSAGES.REQUIRED;

  if (password.length < VALIDATION_RULES.USER.PASSWORD.MIN_LENGTH) {
    return VALIDATION_MESSAGES.PASSWORD_TOO_SHORT;
  }

  if (password.length > VALIDATION_RULES.USER.PASSWORD.MAX_LENGTH) {
    return `Password cannot exceed ${VALIDATION_RULES.USER.PASSWORD.MAX_LENGTH} characters`;
  }

  const passwordRegex = VALIDATION_RULES.USER.PASSWORD.PATTERN;
  if (!passwordRegex.test(password)) {
    return VALIDATION_MESSAGES.PASSWORD_PATTERN;
  }

  return "";
};

/**
 * Validate post content
 */
export const validatePostContent = (content) => {
  if (!content || content.trim().length === 0) {
    return VALIDATION_MESSAGES.REQUIRED;
  }

  if (content.length > VALIDATION_RULES.POST.CONTENT.MAX_LENGTH) {
    return VALIDATION_MESSAGES.POST_CONTENT_TOO_LONG;
  }

  return "";
};

/**
 * Validate comment content
 */
export const validateCommentContent = (content) => {
  if (!content || content.trim().length === 0) {
    return VALIDATION_MESSAGES.REQUIRED;
  }

  if (content.length > VALIDATION_RULES.POST.COMMENT.MAX_LENGTH) {
    return VALIDATION_MESSAGES.COMMENT_TOO_LONG;
  }

  return "";
};

/**
 * Validate message content
 */
export const validateMessageContent = (content) => {
  if (!content || content.trim().length === 0) {
    return VALIDATION_MESSAGES.REQUIRED;
  }

  if (content.length > VALIDATION_RULES.CHAT.MESSAGE.MAX_LENGTH) {
    return VALIDATION_MESSAGES.MESSAGE_TOO_LONG;
  }

  return "";
};

/**
 * Validate file upload
 */
export const validateFile = (file, options = {}) => {
  if (!file) return "No file provided";

  const {
    allowedTypes = [
      ...VALIDATION_RULES.FILE.ALLOWED_IMAGE_TYPES,
      ...VALIDATION_RULES.FILE.ALLOWED_VIDEO_TYPES,
      ...VALIDATION_RULES.FILE.ALLOWED_DOCUMENT_TYPES,
    ],
    maxSize = VALIDATION_RULES.FILE.MAX_SIZE,
  } = options;

  if (!isValidFileType(file, allowedTypes)) {
    return VALIDATION_MESSAGES.FILE_TYPE_NOT_ALLOWED;
  }

  if (!isValidFileSize(file, maxSize)) {
    return VALIDATION_MESSAGES.FILE_TOO_LARGE;
  }

  return "";
};

/**
 * Validate search query
 */
export const validateSearchQuery = (query) => {
  if (!query) return VALIDATION_MESSAGES.REQUIRED;

  if (query.length < VALIDATION_RULES.SEARCH.QUERY.MIN_LENGTH) {
    return VALIDATION_MESSAGES.SEARCH_QUERY_TOO_SHORT;
  }

  if (query.length > VALIDATION_RULES.SEARCH.QUERY.MAX_LENGTH) {
    return `Search query cannot exceed ${VALIDATION_RULES.SEARCH.QUERY.MAX_LENGTH} characters`;
  }

  return "";
};

/**
 * Validate user profile data
 */
export const validateUserProfile = (profile) => {
  const errors = {};

  if (
    profile.firstName &&
    profile.firstName.length > VALIDATION_RULES.USER.NAME.FIRST_NAME_MAX_LENGTH
  ) {
    errors.firstName = `First name cannot exceed ${VALIDATION_RULES.USER.NAME.FIRST_NAME_MAX_LENGTH} characters`;
  }

  if (
    profile.lastName &&
    profile.lastName.length > VALIDATION_RULES.USER.NAME.LAST_NAME_MAX_LENGTH
  ) {
    errors.lastName = `Last name cannot exceed ${VALIDATION_RULES.USER.NAME.LAST_NAME_MAX_LENGTH} characters`;
  }

  if (
    profile.bio &&
    profile.bio.length > VALIDATION_RULES.USER.NAME.BIO_MAX_LENGTH
  ) {
    errors.bio = `Bio cannot exceed ${VALIDATION_RULES.USER.NAME.BIO_MAX_LENGTH} characters`;
  }

  return errors;
};

/**
 * Validate post tags
 */
export const validatePostTags = (tags) => {
  if (!tags || !Array.isArray(tags)) return "";

  if (tags.length > VALIDATION_RULES.POST.TAGS.MAX_COUNT) {
    return `Cannot add more than ${VALIDATION_RULES.POST.TAGS.MAX_COUNT} tags`;
  }

  for (const tag of tags) {
    if (tag.length > VALIDATION_RULES.POST.TAGS.MAX_LENGTH) {
      return `Tag cannot exceed ${VALIDATION_RULES.POST.TAGS.MAX_LENGTH} characters`;
    }
  }

  return "";
};

/**
 * Check if file type is valid
 */
const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

/**
 * Check if file size is valid
 */
const isValidFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

/**
 * Comprehensive form validator
 */
export const createValidator = (rules) => {
  return (values) => {
    const errors = {};

    for (const [field, rule] of Object.entries(rules)) {
      const value = values[field];

      if (
        rule.required &&
        (!value || (typeof value === "string" && !value.trim()))
      ) {
        errors[field] = rule.requiredMessage || VALIDATION_MESSAGES.REQUIRED;
        continue;
      }

      if (value && rule.minLength && value.length < rule.minLength) {
        errors[field] =
          rule.minLengthMessage ||
          `Must be at least ${rule.minLength} characters`;
        continue;
      }

      if (value && rule.maxLength && value.length > rule.maxLength) {
        errors[field] =
          rule.maxLengthMessage || `Cannot exceed ${rule.maxLength} characters`;
        continue;
      }

      if (value && rule.pattern && !rule.pattern.test(value)) {
        errors[field] = rule.patternMessage || "Invalid format";
        continue;
      }

      if (value && rule.validate) {
        const customError = rule.validate(value, values);
        if (customError) {
          errors[field] = customError;
        }
      }
    }

    return errors;
  };
};
