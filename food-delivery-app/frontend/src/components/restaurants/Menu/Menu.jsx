import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../../contexts/CartContext";
import { restaurantService } from "../../../services/restaurantService";
import "./Menu.css";

const Menu = () => {
  const { restaurantId } = useParams();
  const { addToCart } = useContext(CartContext);
  const [menu, setMenu] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    loadRestaurantAndMenu();
  }, [restaurantId]);

  const loadRestaurantAndMenu = async () => {
    try {
      setLoading(true);

      // Load restaurant details
      const restaurantResponse = await restaurantService.getRestaurantById(
        restaurantId
      );
      setRestaurant(restaurantResponse.data);

      // Load menu
      const menuResponse = await restaurantService.getMenuByRestaurantId(
        restaurantId
      );
      setMenu(menuResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = () => {
    const categories = ["all"];
    // In a real app, you'd have categories from the API
    // For now, we'll use cuisine type as the main category
    if (restaurant) {
      categories.push(restaurant.cuisine.toLowerCase());
    }
    return [...new Set(categories)];
  };

  const getFilteredMenu = () => {
    if (activeCategory === "all") return menu;

    // Filter by category (in real app, items would have categories)
    return menu.filter(
      (item) =>
        item.category?.toLowerCase() === activeCategory ||
        restaurant.cuisine.toLowerCase() === activeCategory
    );
  };

  const handleQuantityChange = (itemId, change) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change),
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item._id] || 1;

    if (quantity > 0) {
      addToCart(
        {
          ...item,
          restaurantId: restaurantId,
          restaurantName: restaurant?.name,
        },
        quantity
      );

      // Reset quantity
      setQuantities((prev) => ({
        ...prev,
        [item._id]: 0,
      }));

      // Show success message
      alert(`Added ${quantity} ${item.name} to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="menu-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-page">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Menu</h2>
          <p>{error}</p>
          <button onClick={loadRestaurantAndMenu}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="menu-page">
        <div className="error-state">
          <h2>Restaurant Not Found</h2>
          <p>The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const categories = getCategories();
  const filteredMenu = getFilteredMenu();

  return (
    <div className="menu-page">
      {/* Restaurant Header */}
      <div className="restaurant-header">
        <div className="restaurant-info">
          <h1>{restaurant.name}</h1>
          <p className="cuisine-type">{restaurant.cuisine}</p>
          <p className="restaurant-description">{restaurant.description}</p>
          <div className="restaurant-meta">
            <span className="rating">⭐ {restaurant.rating}</span>
            <span className="delivery-time">
              🕒 {restaurant.deliveryTime} min
            </span>
            <span
              className={`status ${restaurant.isActive ? "open" : "closed"}`}
            >
              {restaurant.isActive ? "🟢 Open" : "🔴 Closed"}
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={`tab ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="menu-items">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item) => (
            <div key={item._id} className="menu-item">
              <div className="item-image">
                <img
                  src={
                    item.image ||
                    `https://via.placeholder.com/150x150?text=${encodeURIComponent(
                      item.name
                    )}`
                  }
                  alt={item.name}
                />
              </div>

              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <p className="item-price">${item.price.toFixed(2)}</p>

                {item.dietaryInfo && (
                  <div className="dietary-tags">
                    {item.dietaryInfo.map((tag) => (
                      <span key={tag} className={`dietary-tag ${tag}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="item-actions">
                <div className="quantity-selector">
                  <button
                    onClick={() => handleQuantityChange(item._id, -1)}
                    disabled={(quantities[item._id] || 0) <= 0}
                  >
                    -
                  </button>
                  <span>{quantities[item._id] || 0}</span>
                  <button onClick={() => handleQuantityChange(item._id, 1)}>
                    +
                  </button>
                </div>

                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(item)}
                  disabled={
                    !restaurant.isActive || (quantities[item._id] || 0) === 0
                  }
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-menu">
            <div className="empty-icon">🍽️</div>
            <h3>No items found</h3>
            <p>No menu items available in this category.</p>
          </div>
        )}
      </div>

      {!restaurant.isActive && (
        <div className="restaurant-closed-banner">
          <p>
            This restaurant is currently closed. You can browse the menu but
            cannot place orders.
          </p>
        </div>
      )}
    </div>
  );
};

export default Menu;
