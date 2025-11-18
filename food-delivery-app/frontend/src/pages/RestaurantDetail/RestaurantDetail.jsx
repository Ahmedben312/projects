import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { restaurantService } from "../../services/restaurantService";
import { useCart } from "../../contexts/CartContext";
import "./RestaurantDetail.css";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await restaurantService.getRestaurant(id);
        if (res && res.success) {
          setRestaurant(res.data || null);
        }
        const menuRes = await restaurantService.getRestaurantMenu(id);
        // backend returns { success:true, data: { restaurant: {...}, menu: [...] } }
        if (menuRes && menuRes.success) {
          // prefer menuRes.data.menu array; also set restaurant info if provided there
          setMenu(menuRes.data?.menu || []);
          if (!restaurant && menuRes.data?.restaurant) {
            setRestaurant((prev) => prev || menuRes.data.restaurant);
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load restaurant");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  const handleAdd = (item) => {
    const cartItem = {
      menuItemId: item._id || item.id || item.menuItemId,
      name: item.name || item.title,
      price: item.price || item.cost || 0,
      quantity: 1,
    };
    addToCart(cartItem, restaurant || {});
  };

  if (loading) return <div className="page restaurant-detail">Loading...</div>;
  if (error)
    return <div className="page restaurant-detail">Error: {error}</div>;
  if (!restaurant)
    return <div className="page restaurant-detail">Restaurant not found</div>;

  return (
    <div className="page restaurant-detail">
      <div className="hero">
        <h1>{restaurant.name}</h1>
        <p>{restaurant.description}</p>
      </div>

      <section className="menu">
        <h2>Menu</h2>
        {menu.length === 0 && <p>No menu items available.</p>}
        <div className="menu-grid">
          {menu.map((item) => (
            <div className="menu-item" key={item._id || item.id}>
              <div className="menu-item-info">
                <h4>{item.name}</h4>
                <p className="price">${(item.price || 0).toFixed(2)}</p>
                <p className="desc">{item.description}</p>
              </div>
              <div className="menu-item-actions">
                <button
                  onClick={() => handleAdd(item)}
                  className="btn btn-primary"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RestaurantDetail;
