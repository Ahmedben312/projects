import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../../../services/orderService";
import MapComponent from "../../common/Map/MapComponent";
import "./OrderTracking.css";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();

    // Set up polling for real-time updates
    const interval = setInterval(loadOrder, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await orderService.getOrderById(orderId);
      setOrder(response.data);
      setError(null);
    } catch (err) {
      setError("Order not found");
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    const steps = [
      {
        status: "pending",
        label: "Order Placed",
        description: "Your order has been received",
      },
      {
        status: "confirmed",
        label: "Order Confirmed",
        description: "Restaurant has confirmed your order",
      },
      {
        status: "preparing",
        label: "Preparing Food",
        description: "Chef is preparing your meal",
      },
      {
        status: "on-the-way",
        label: "On the Way",
        description: "Driver is delivering your order",
      },
      {
        status: "delivered",
        label: "Delivered",
        description: "Order has been delivered",
      },
    ];

    const currentStatusIndex = steps.findIndex(
      (step) => step.status === order?.status
    );

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStatusIndex,
      current: index === currentStatusIndex,
    }));
  };

  const getEstimatedTime = () => {
    if (!order?.estimatedDelivery) return "Calculating...";

    const now = new Date();
    const deliveryTime = new Date(order.estimatedDelivery);
    const diffMs = deliveryTime - now;
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins <= 0) return "Any moment now";
    return `${diffMins} minutes`;
  };

  if (loading) {
    return (
      <div className="order-tracking">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-tracking">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h2>Order Not Found</h2>
          <p>{error || "The order you are looking for does not exist."}</p>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <div className="order-tracking">
      <div className="tracking-header">
        <h1>Track Your Order</h1>
        <div className="order-info-banner">
          <div className="order-id">Order #{order._id}</div>
          <div className={`status-badge ${order.status}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>
      </div>

      <div className="tracking-content">
        {/* Progress Timeline */}
        <div className="progress-section">
          <h2>Order Progress</h2>
          <div className="timeline">
            {statusSteps.map((step, index) => (
              <div
                key={step.status}
                className={`timeline-step ${
                  step.completed ? "completed" : ""
                } ${step.current ? "current" : ""}`}
              >
                <div className="step-marker">
                  {step.completed ? "✓" : index + 1}
                </div>
                <div className="step-content">
                  <h4>{step.label}</h4>
                  <p>{step.description}</p>
                  {step.current && order.updates && (
                    <div className="current-update">
                      <em>Latest: {order.updates[order.updates.length - 1]}</em>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Map */}
        <div className="map-section">
          <h2>Delivery Progress</h2>
          <div className="tracking-map">
            <MapComponent
              center={
                order.driver?.location || {
                  latitude: 40.7128,
                  longitude: -74.006,
                }
              }
              markers={[
                {
                  position: order.driver?.location || {
                    latitude: 40.7128,
                    longitude: -74.006,
                  },
                  type: "driver",
                  title: `Driver: ${order.driver?.name || "Unknown"}`,
                },
              ]}
              zoom={13}
            />
          </div>

          <div className="delivery-info">
            <div className="info-card">
              <h4>Estimated Arrival</h4>
              <p className="estimated-time">{getEstimatedTime()}</p>
            </div>

            {order.driver && (
              <div className="info-card">
                <h4>Your Driver</h4>
                <p>{order.driver.name}</p>
                <p className="driver-vehicle">
                  {order.driver.vehicle || "Car"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="order-details-section">
          <h2>Order Details</h2>
          <div className="order-items-list">
            {order.items.map((item) => (
              <div key={item.menuItemId} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">Qty: {item.quantity}</span>
                </div>
                <span className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="order-total">
            <strong>Total: ${order.total?.toFixed(2) || "0.00"}</strong>
          </div>
        </div>

        {/* Updates Log */}
        {order.updates && order.updates.length > 0 && (
          <div className="updates-section">
            <h2>Order Updates</h2>
            <div className="updates-list">
              {order.updates.map((update, index) => (
                <div key={index} className="update-item">
                  <div className="update-time">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </div>
                  <div className="update-message">{update}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="support-section">
        <h3>Need Help?</h3>
        <p>If you have any questions about your order, contact support:</p>
        <div className="support-actions">
          <button className="support-btn call-btn">📞 Call Support</button>
          <button className="support-btn chat-btn">💬 Live Chat</button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
