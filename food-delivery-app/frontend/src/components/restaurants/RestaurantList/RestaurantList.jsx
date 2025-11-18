import React, { useState, useEffect } from "react";
import RestaurantCard from "../RestaurantCard/RestaurantCard";
import { restaurantService } from "../../../services/restaurantService";
import "./RestaurantList.css";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    city: "",
    cuisine: "all",
    search: "",
  });

  useEffect(() => {
    loadRestaurants();
  }, [filters]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantService.getRestaurants(filters);
      setRestaurants(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return (
      <div className="restaurant-list">
        <div className="loading-state">
          <div className="icon">⏳</div>
          <p>Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="restaurant-list">
        <div className="error-state">
          <div className="icon">⚠️</div>
          <p>Error: {error}</p>
          <button onClick={loadRestaurants}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-list">
      <div className="list-header">
        <h1>Restaurants</h1>
        <div className="search-sort">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search restaurants..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
            />
          </div>
          <div className="filter-group">
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange({ city: e.target.value })}
            >
              <option value="">All Cities</option>
              <option value="Sfax">Sfax</option>
              <option value="New York">New York</option>
            </select>
          </div>
          <div className="filter-group">
            <select
              value={filters.cuisine}
              onChange={(e) => handleFilterChange({ cuisine: e.target.value })}
            >
              <option value="all">All Cuisines</option>
              <option value="Italian">Italian</option>
              <option value="Japanese">Japanese</option>
              <option value="American">American</option>
              <option value="Pastry">Pastry</option>
              <option value="French">French</option>
              <option value="Mediterranean">Mediterranean</option>
              <option value="Moroccan">Moroccan</option>
              <option value="Tunisian">Tunisian</option>
              <option value="Chinese">Chinese</option>
              <option value="Mexican">Mexican</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>
        </div>
      </div>

      <div className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="empty-state">
          <div className="icon">🍽️</div>
          <h3>No restaurants found</h3>
          <p>Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
