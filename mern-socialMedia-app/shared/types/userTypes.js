export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
  SUPER_ADMIN: "super_admin",
};

export const USER_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  BANNED: "banned",
  DELETED: "deleted",
};

export const USER_PRIVACY = {
  PUBLIC: "public",
  PRIVATE: "private",
  FRIENDS_ONLY: "friends_only",
};

export const USER_PREFERENCES = {
  EMAIL_NOTIFICATIONS: {
    ALL: "all",
    IMPORTANT: "important",
    NONE: "none",
  },
  PUSH_NOTIFICATIONS: {
    ENABLED: true,
    DISABLED: false,
  },
  THEME: {
    LIGHT: "light",
    DARK: "dark",
    AUTO: "auto",
  },
};

export const USER_RELATIONSHIP_STATUS = {
  SINGLE: "single",
  IN_RELATIONSHIP: "in_relationship",
  MARRIED: "married",
  COMPLICATED: "complicated",
  SEPARATED: "separated",
  DIVORCED: "divorced",
  WIDOWED: "widowed",
};

export const GENDER = {
  MALE: "male",
  FEMALE: "female",
  NON_BINARY: "non_binary",
  OTHER: "other",
  PREFER_NOT_TO_SAY: "prefer_not_to_say",
};
