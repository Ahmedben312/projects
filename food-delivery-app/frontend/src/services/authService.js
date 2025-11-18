import { apiService } from "./api";

class AuthService {
  async login(email, password) {
    try {
      const response = await apiService.post("/auth/login", {
        email,
        password,
      });

      if (response.success) {
        apiService.setToken(response.token);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async register(userData) {
    try {
      const response = await apiService.post("/auth/register", userData);

      if (response.success) {
        apiService.setToken(response.token);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getCurrentUser() {
    try {
      const response = await apiService.get("/auth/me");
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await apiService.put("/auth/profile", profileData);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async updatePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.put("/auth/password", {
        currentPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  setToken(token) {
    apiService.setToken(token);
  }

  logout() {
    apiService.setToken(null);
  }
}

export const authService = new AuthService();
