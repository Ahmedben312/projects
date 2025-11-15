import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../features/notifications/notificationsSlice";
import { formatTimestamp } from "../../utils/helpers";
import "./Notifications.css";

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector(
    (state) => state.notifications
  );
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = async (notificationId) => {
    await dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllNotificationsAsRead());
  };

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

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread") {
      return !notification.read;
    }
    return true;
  });

  if (loading && notifications.length === 0) {
    return (
      <div className="notifications-page">
        <div className="notifications-header">
          <h1>Notifications</h1>
        </div>
        <div className="loading">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="btn btn-primary mark-all-read-btn"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-tabs">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`tab ${activeTab === "unread" ? "active" : ""}`}
          onClick={() => setActiveTab("unread")}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            <div className="no-notifications-icon">🔔</div>
            <h3>No notifications</h3>
            <p>When you get notifications, they'll appear here.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${
                notification.read ? "read" : "unread"
              }`}
            >
              <Link
                to={getNotificationLink(notification)}
                className="notification-link"
                onClick={() =>
                  !notification.read && handleMarkAsRead(notification._id)
                }
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <div className="notification-message">
                    {getNotificationMessage(notification)}
                  </div>

                  {notification.post?.content && (
                    <div className="notification-preview">
                      "{notification.post.content.substring(0, 100)}
                      {notification.post.content.length > 100 ? "..." : ""}"
                    </div>
                  )}

                  <div className="notification-time">
                    {formatTimestamp(notification.createdAt)}
                  </div>
                </div>

                {!notification.read && (
                  <div className="notification-indicator"></div>
                )}
              </Link>

              <button
                className="notification-mark-read"
                onClick={() => handleMarkAsRead(notification._id)}
                title="Mark as read"
              >
                ✓
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
