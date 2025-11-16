import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h2>LearnHub</h2>
          </Link>

          <nav className="nav">
            <Link to="/courses">Browse Courses</Link> {/* Fixed link */}
            {user ? (
              <div className="user-menu">
                {user.role === "student" && (
                  <>
                    <Link to="/student/dashboard">Dashboard</Link>
                    <Link to="/student/courses">My Courses</Link>
                  </>
                )}
                {user.role === "instructor" && (
                  <>
                    <Link to="/educator/dashboard">Dashboard</Link>
                    <Link to="/educator/courses">My Courses</Link>
                  </>
                )}
                <div className="dropdown">
                  <span>Welcome, {user.name}</span>
                  <div className="dropdown-content">
                    <Link to="/profile">Profile</Link> {/* Fixed link */}
                    <Link to="/my-certificates">Certificates</Link>{" "}
                    {/* Fixed link */}
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
