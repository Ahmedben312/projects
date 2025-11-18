import { restaurants, menus } from "../mock/data";

// Use mock data by default for local development.
const USE_MOCKS = true;

class RestaurantService {
  async getRestaurants(filters = {}) {
    if (USE_MOCKS) {
      const data = restaurants.filter((r) => r.isActive);
      return {
        success: true,
        count: data.length,
        total: data.length,
        pagination: { page: 1, pages: 1 },
        data,
      };
    }

    try {
      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const url = `/restaurants${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getRestaurant(id) {
    if (USE_MOCKS) {
      const r = restaurants.find((x) => x._id === id);
      if (!r) return { success: false, message: "Restaurant not found" };
      return { success: true, data: r };
    }

    try {
      const response = await apiService.get(`/restaurants/${id}`);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getRestaurantMenu(id) {
    if (USE_MOCKS) {
      const menu = menus[id] || [];
      const restaurant = restaurants.find((r) => r._id === id) || null;
      return { success: true, data: { restaurant, menu } };
    }

    try {
      const response = await apiService.get(`/restaurants/${id}/menu`);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getNearbyRestaurants(latitude, longitude, maxDistance = 5000) {
    if (USE_MOCKS) {
      const data = restaurants.slice(0, 3);
      return { success: true, count: data.length, data };
    }

    try {
      const response = await apiService.get(
        `/restaurants/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async searchRestaurants(query, filters = {}) {
    if (USE_MOCKS) {
      const q = (query || "").toLowerCase();
      const data = restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q)
      );
      return { success: true, count: data.length, data };
    }

    try {
      const queryParams = new URLSearchParams({ q: query });

      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await apiService.get(
        `/restaurants/search?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

export const restaurantService = new RestaurantService();
