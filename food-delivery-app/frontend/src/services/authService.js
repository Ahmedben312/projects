import { apiService } from "./api";

// Mock user data for development
const mockUsers = [
  {
    id: 1,
    email: "user@example.com",
    password: "password",
    name: "John Doe",
    phone: "+1234567890",
    address: {
      street: "123 Main St",
      city: "New York",
      zipCode: "10001",
    },
  },
];

// Mock authentication service
export const authService = {
  // Login user
  login: async (email, password) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find user in mock data
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      // Store user in localStorage
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      localStorage.setItem("authToken", "mock-jwt-token-" + Date.now());

      return {
        user: userWithoutPassword,
        token: "mock-jwt-token-" + Date.now(),
      };
    } else {
      throw new Error("Invalid email or password");
    }
  },

  // Register new user
  register: async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === userData.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
    };

    mockUsers.push(newUser);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    // Store user in localStorage
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    localStorage.setItem("authToken", "mock-jwt-token-" + Date.now());

    return {
      user: userWithoutPassword,
      token: "mock-jwt-token-" + Date.now(),
    };
  },

  // Logout user
  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");

    return { success: true };
  },

  // Get current user
  getCurrentUser: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = localStorage.getItem("currentUser");
    const token = localStorage.getItem("authToken");

    if (user && token) {
      return {
        user: JSON.parse(user),
        token: token,
      };
    }

    throw new Error("No user logged in");
  },

  // Update user profile
  updateProfile: async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const updatedUser = { ...currentUser, ...userData };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    return { user: updatedUser };
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // In a real app, you would verify current password first
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const userInMock = mockUsers.find((u) => u.id === currentUser.id);

    if (userInMock && userInMock.password === currentPassword) {
      userInMock.password = newPassword;
      return { success: true };
    } else {
      throw new Error("Current password is incorrect");
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      throw new Error("No user found with this email");
    }

    // In a real app, you would send an email here
    return {
      success: true,
      message: "Password reset instructions sent to your email",
    };
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // In a real app, you would verify the token
    return { success: true, message: "Password reset successfully" };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem("authToken");
  },
};

export default authService;
