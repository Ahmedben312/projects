import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; // Updated path
import { useCart } from "../../../contexts/CartContext"; // Updated path
import "./Header.scss";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="grid-container">
        <div className="header-content">
          <div className="header-logo">
            <Link to="/" className="logo-link">
              <h1>FoodDelivery</h1>
            </Link>
          </div>

          <nav className={`header-nav ${isMenuOpen ? "is-open" : ""}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/restaurants" className="nav-link">
                  Restaurants
                </Link>
              </li>

              {user ? (
                <>
                  <li className="nav-item">
                    <Link to="/profile" className="nav-link">
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/orders" className="nav-link">
                      My Orders
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="nav-link nav-button"
                    >
                      Logout
                    </button>
                  </li>
                  <li className="nav-item">
                    <Link to="/cart" className="nav-link cart-link">
                      Cart ({getTotalItems()})
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <div className="header-actions">
            {user && (
              <Link to="/cart" className="cart-button">
                Cart ({getTotalItems()})
              </Link>
            )}
            <button className="menu-toggle" onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
