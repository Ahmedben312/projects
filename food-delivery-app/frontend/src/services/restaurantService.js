import { restaurants, menus } from "../mock/data";

// Mock service for restaurants
export const restaurantService = {
  // Get all restaurants
  getRestaurants: async (filters = {}) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredRestaurants = [...restaurants];

    // Apply filters
    if (filters.city) {
      filteredRestaurants = filteredRestaurants.filter(
        (restaurant) => restaurant.address.city === filters.city
      );
    }

    if (filters.cuisine && filters.cuisine !== "all") {
      filteredRestaurants = filteredRestaurants.filter(
        (restaurant) => restaurant.cuisine === filters.cuisine
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredRestaurants = filteredRestaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchTerm) ||
          restaurant.cuisine.toLowerCase().includes(searchTerm) ||
          restaurant.description.toLowerCase().includes(searchTerm)
      );
    }

    return {
      data: filteredRestaurants,
      total: filteredRestaurants.length,
    };
  },

  // Get restaurant by ID
  getRestaurantById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const restaurant = restaurants.find((r) => r._id === id);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    return { data: restaurant };
  },

  // Get menu by restaurant ID
  getMenuByRestaurantId: async (restaurantId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const menuItems = menus[restaurantId] || [];
    return { data: menuItems };
  },

  // Search restaurants
  searchRestaurants: async (query) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const searchTerm = query.toLowerCase();
    const results = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm) ||
        restaurant.description.toLowerCase().includes(searchTerm)
    );

    return { data: results };
  },
};

export default restaurantService;
