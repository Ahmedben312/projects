import React, { useState, useEffect } from "react";
import { restaurantService } from "../../../../services/restaurantService";
import RestaurantCard from "../RestaurantCard/RestaurantCard";
import "./RestaurantList.scss";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    cuisine: "",
    minRating: 0,
  });

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, filters]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantService.getRestaurants();
      if (response.success) {
        setRestaurants(response.data);
      } else {
        setError("Failed to load restaurants");
      }
    } catch (err) {
      setError("Error loading restaurants");
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = () => {
    let filtered = restaurants;

    if (filters.city) {
      filtered = filtered.filter((restaurant) =>
        restaurant.address.city
          .toLowerCase()
          .includes(filters.city.toLowerCase())
      );
    }

    if (filters.cuisine) {
      filtered = filtered.filter((restaurant) =>
        restaurant.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())
      );
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(
        (restaurant) => restaurant.rating >= filters.minRating
      );
    }

    setFilteredRestaurants(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  if (loading) {
    return <div className="loading">Loading restaurants...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="restaurant-list-page">
      <div className="grid-container">
        <div className="page-header">
          <h1>Restaurants</h1>
          <p>Discover amazing food from local restaurants</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="grid-x grid-margin-x">
            <div className="cell medium-4">
              <div className="filter-group">
                <label>City</label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                >
                  <option value="">All Cities</option>
                  <option value="Sfax">Sfax</option>
                  <option value="NYC">New York City</option>
                </select>
              </div>
            </div>

            <div className="cell medium-4">
              <div className="filter-group">
                <label>Cuisine</label>
                <select
                  value={filters.cuisine}
                  onChange={(e) =>
                    handleFilterChange("cuisine", e.target.value)
                  }
                >
                  <option value="">All Cuisines</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="American">American</option>
                </select>
              </div>
            </div>

            <div className="cell medium-4">
              <div className="filter-group">
                <label>Minimum Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) =>
                    handleFilterChange("minRating", parseFloat(e.target.value))
                  }
                >
                  <option value={0}>Any Rating</option>
                  <option value={4}>4+ Stars</option>
                  <option value={3}>3+ Stars</option>
                  <option value={2}>2+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>
            Showing {filteredRestaurants.length} of {restaurants.length}{" "}
            restaurants
          </p>
        </div>

        {/* Restaurant Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="no-results">
            <h3>No restaurants found</h3>
            <p>Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <div className="restaurant-grid">
            <div className="grid-x grid-margin-x grid-margin-y">
              {filteredRestaurants.map((restaurant) => (
                <div key={restaurant._id} className="cell medium-6 large-4">
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
