import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { orderService } from "../../../services/orderService";
import "./OrderHistory.css";

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });

  useEffect(() => {
    loadOrders();
  }, [filters]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // For mock data, we'll use localStorage orders
      const storedOrders = JSON.parse(
        localStorage.getItem("userOrders") || "[]"
      );

      let filteredOrders = storedOrders;

      // Apply status filter
      if (filters.status !== "all") {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === filters.status
        );
      }

      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredOrders = filteredOrders.filter(
          (order) =>
            order._id.toLowerCase().includes(searchTerm) ||
            order.items.some((item) =>
              item.name.toLowerCase().includes(searchTerm)
            )
        );
      }

      // Sort by date (newest first)
      filteredOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(filteredOrders);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "pending", text: "Pending" },
      confirmed: { class: "preparing", text: "Confirmed" },
      preparing: { class: "preparing", text: "Preparing" },
      "on-the-way": { class: "on-the-way", text: "On the Way" },
      delivered: { class: "completed", text: "Delivered" },
      cancelled: { class: "cancelled", text: "Cancelled" },
    };

    const config = statusConfig[status] || { class: "pending", text: status };
    return (
      <span className={`status-badge ${config.class}`}>{config.text}</span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="order-history">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history">
      <div className="page-header">
        <h1>Order History</h1>
        <p>View and track your previous orders</p>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search orders..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="on-the-way">On the Way</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3 className="order-number">Order #{order._id}</h3>
                <p className="order-date">{formatDate(order.createdAt)}</p>
              </div>
              {getStatusBadge(order.status)}
            </div>

            <div className="order-details">
              <div className="order-items-preview">
                <strong>Items:</strong>
                <span>{order.items.map((item) => item.name).join(", ")}</span>
              </div>

              <div className="order-meta">
                <div className="meta-item">
                  <strong>Total:</strong>
                  <span>${order.total?.toFixed(2) || "0.00"}</span>
                </div>

                {order.estimatedDelivery && (
                  <div className="meta-item">
                    <strong>Estimated Delivery:</strong>
                    <span>{formatDate(order.estimatedDelivery)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="order-actions">
              <Link
                to={`/track-order/${order._id}`}
                className="action-btn track-btn"
              >
                Track Order
              </Link>

              {order.status === "delivered" && (
                <button className="action-btn reorder-btn">Reorder</button>
              )}

              {order.status === "pending" && (
                <button className="action-btn cancel-btn">Cancel Order</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders found</h3>
          <p>
            {filters.status !== "all" || filters.search
              ? "Try adjusting your filters to see more orders"
              : "You haven't placed any orders yet"}
          </p>
          {!filters.search && filters.status === "all" && (
            <Link to="/restaurants" className="browse-btn">
              Start Ordering
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
