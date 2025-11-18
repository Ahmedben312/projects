import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem("token");
    if (token) {
      authService.setToken(token);
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      } else {
        localStorage.removeItem("token");
        authService.setToken(null);
      }
    } catch (error) {
      localStorage.removeItem("token");
      authService.setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError("");
      const response = await authService.login(email, password);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem("token", response.token);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const register = async (userData) => {
    try {
      setError("");
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem("token", response.token);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    authService.setToken(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success) {
        setUser(response.data);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      setError("Profile update failed.");
      return { success: false, message: "Profile update failed." };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export { AuthContext }; // Add this line to export the context
