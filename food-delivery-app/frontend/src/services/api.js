// Main API service that can switch between mock and real backend
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Check if we should use mock data (during development)
const USE_MOCK_DATA =
  !process.env.REACT_APP_API_URL || process.env.NODE_ENV === "development";

export const apiService = {
  // Generic GET request
  get: async (endpoint) => {
    if (USE_MOCK_DATA) {
      // Import mock services dynamically to avoid circular dependencies
      const module = await import("./restaurantService");
      return module.restaurantService.getRestaurants();
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },

  // Generic POST request
  post: async (endpoint, data) => {
    if (USE_MOCK_DATA) {
      const module = await import("./orderService");
      return module.orderService.createOrder(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },

  // Generic PUT request
  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },

  // Generic DELETE request
  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },
};

// Also export as default for backward compatibility
export default apiService;
