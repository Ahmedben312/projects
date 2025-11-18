import React from "react";
import { Link } from "react-router-dom";
import "./RestaurantCard.css";

const RestaurantCard = ({ restaurant }) => {
  const {
    _id,
    name,
    cuisine,
    description,
    rating,
    deliveryTime,
    image,
    address,
    isActive,
  } = restaurant;

  return (
    <Link to={`/restaurant/${_id}`} className="restaurant-card">
      <div className="card-image">
        <img src={image} alt={name} />
        <div className={`restaurant-status ${isActive ? "open" : "closed"}`}>
          {isActive ? "Open" : "Closed"}
        </div>
      </div>

      <div className="restaurant-info">
        <h3 className="restaurant-name">{name}</h3>
        <p className="restaurant-cuisine">{cuisine}</p>
        <p className="restaurant-description">{description}</p>

        <div className="restaurant-meta">
          <div className="rating">
            <span>⭐ {rating}</span>
          </div>
          <div className="delivery-info">
            <span>{deliveryTime} min</span>
          </div>
        </div>

        <div className="restaurant-location">
          <span>
            {address.street}, {address.city}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
