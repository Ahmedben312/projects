import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import {
  fetchNotifications,
  addNotification,
  markAsReadLocal,
} from "../../features/notifications/notificationsSlice";
import Search from "../Search/Search";
import "./Layout.css";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount, notifications } = useSelector(
    (state) => state.notifications
  );

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleNotificationClick = (notificationId) => {
    dispatch(markAsReadLocal(notificationId));
    setShowNotifications(false);
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              SocialApp
            </Link>

            {/* Search Bar */}
            <div className="search-wrapper">
              <Search />
            </div>

            <nav className="nav">
              <Link
                to="/"
                className={`nav-link ${isActiveRoute("/") ? "active" : ""}`}
              >
                <i className="icon-home"></i>
                <span className="nav-text">Home</span>
              </Link>

              <Link
                to="/chat"
                className={`nav-link ${
                  location.pathname.startsWith("/chat") ? "active" : ""
                }`}
              >
                <i className="icon-chat"></i>
                <span className="nav-text">Messages</span>
              </Link>

              <div className="nav-link notifications-container">
                <button
                  className={`notification-btn ${
                    isActiveRoute("/notifications") ? "active" : ""
                  }`}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <i className="icon-notifications"></i>
                  <span className="nav-text">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>

                {showNotifications && (
                  <div className="notifications-dropdown">
                    <div className="notifications-header">
                      <h3>Notifications</h3>
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifications(false)}
                      >
                        View All
                      </Link>
                    </div>
                    <div className="notifications-list">
                      {recentNotifications.length === 0 ? (
                        <p className="no-notifications">No new notifications</p>
                      ) : (
                        recentNotifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`notification-dropdown-item ${
                              notification.read ? "read" : "unread"
                            }`}
                            onClick={() =>
                              handleNotificationClick(notification._id)
                            }
                          >
                            <Link
                              to={getNotificationLink(notification)}
                              className="notification-dropdown-link"
                            >
                              <div className="notification-dropdown-icon">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="notification-dropdown-content">
                                <div className="notification-dropdown-message">
                                  {getNotificationMessage(notification)}
                                </div>
                                <div className="notification-dropdown-time">
                                  {formatTimestamp(notification.createdAt)}
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            <div className="user-menu-container">
              <button
                className="user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <img
                  src={user?.profile?.avatar || "/default-avatar.png"}
                  alt="Profile"
                  className="user-avatar"
                />
                <span className="username">{user?.username}</span>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <Link
                    to={`/profile/${user?.id}`}
                    className="dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <i className="icon-profile"></i>
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <i className="icon-settings"></i>
                    Settings
                  </Link>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    <i className="icon-logout"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">{children}</div>
      </main>

      {/* Overlay for closing dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="overlay"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </div>
  );
};

// Helper functions for notifications
const getNotificationIcon = (type) => {
  switch (type) {
    case "like":
      return "❤️";
    case "comment":
      return "💬";
    case "follow":
      return "👤";
    case "message":
      return "✉️";
    case "share":
      return "🔄";
    default:
      return "🔔";
  }
};

const getNotificationMessage = (notification) => {
  const senderName = notification.sender?.profile?.firstName
    ? `${notification.sender.profile.firstName} ${notification.sender.profile.lastName}`
    : notification.sender?.username;

  switch (notification.type) {
    case "like":
      return `${senderName} liked your post`;
    case "comment":
      return `${senderName} commented on your post`;
    case "follow":
      return `${senderName} started following you`;
    case "message":
      return `${senderName} sent you a message`;
    case "share":
      return `${senderName} shared your post`;
    default:
      return "New notification";
  }
};

const getNotificationLink = (notification) => {
  switch (notification.type) {
    case "like":
    case "comment":
    case "share":
      return notification.post ? `/post/${notification.post._id}` : "/";
    case "follow":
      return `/profile/${notification.sender._id}`;
    case "message":
      return `/chat`;
    default:
      return "/";
  }
};

const formatTimestamp = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
};

export default Layout;
