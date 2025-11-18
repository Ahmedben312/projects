import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { restaurantService } from "../../services/restaurantService";
import "./Home.scss";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await restaurantService.getRestaurants();
        if (res && res.success) {
          setRestaurants(res.data || []);
        } else {
          setError(res.message || "Failed to load restaurants");
        }
      } catch (err) {
        setError(err.message || "Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading)
    return <div className="page home-page">Loading restaurants...</div>;
  if (error) return <div className="page home-page">Error: {error}</div>;

  return (
    <div className="page home-page">
      <h1>Restaurants</h1>
      <div className="restaurants-list">
        {restaurants.length === 0 && <p>No restaurants found.</p>}
        {restaurants.map((r) => (
          <Link
            to={`/restaurant/${r._id}`}
            className="restaurant-card"
            key={r._id}
          >
            <div
              className="restaurant-image"
              style={{ backgroundImage: `url(${r.image || ""})` }}
            />
            <div className="restaurant-info">
              <h3>{r.name}</h3>
              <p className="cuisine">{r.cuisine || ""}</p>
              <p className="meta">
                {r.rating ? `⭐ ${r.rating}` : "No rating"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
