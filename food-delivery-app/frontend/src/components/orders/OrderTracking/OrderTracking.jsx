import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../../contexts/SocketContext";
import { orderService } from "../../../services/orderService";
import MapComponent from "../../common/Map/MapComponent";
import "./OrderTracking.scss";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const { socket, isConnected } = useSocket();

  const statusSteps = [
    { key: "PENDING", label: "Order Placed" },
    { key: "CONFIRMED", label: "Order Confirmed" },
    { key: "PREPARING", label: "Preparing Food" },
    { key: "READY_FOR_PICKUP", label: "Ready for Pickup" },
    { key: "PICKED_UP", label: "Picked Up" },
    { key: "ON_THE_WAY", label: "On the Way" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  useEffect(() => {
    if (!socket || !orderId) return;

    // Join order room for real-time updates (emit both common event names for compatibility)
    socket.emit("order_join", orderId);
    socket.emit("join_order_room", orderId);

    // Listen for order updates
    socket.on("order_updated", (updatedOrder) => {
      setOrder(updatedOrder);
    });

    // Listen for driver location updates. Payload may be { driverId, location } or direct { latitude, longitude }
    socket.on("driver_location_updated", (payload) => {
      const loc = payload?.location || payload;
      if (!loc) return;
      const lat = loc.latitude ?? loc.lat;
      const lng = loc.longitude ?? loc.lng;
      if (lat != null && lng != null) {
        setDriverLocation({ lat, lng });
      }
    });

    return () => {
      socket.off("order_updated");
      socket.off("driver_location_updated");
    };
  }, [socket, orderId]);

  useEffect(() => {
    // Fetch initial order data (use orderService which may use mocks)
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrder(orderId);
        if (res && res.success) setOrder(res.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div className="loading">Loading order details...</div>;
  }

  const currentStatusIndex = statusSteps.findIndex(
    (step) => step.key === order.status
  );

  return (
    <div className="order-tracking">
      <div className="grid-container">
        <div className="grid-x grid-margin-x">
          <div className="cell medium-6">
            <div className="order-status-card">
              <h3>Order Status</h3>
              <div className="status-timeline">
                {statusSteps.map((step, index) => (
                  <div
                    key={step.key}
                    className={`status-step ${
                      index <= currentStatusIndex ? "completed" : ""
                    } ${index === currentStatusIndex ? "current" : ""}`}
                  >
                    <div className="step-indicator">
                      {index <= currentStatusIndex ? "✓" : index + 1}
                    </div>
                    <div className="step-label">{step.label}</div>
                    {index < statusSteps.length - 1 && (
                      <div className="step-connector"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="order-details-card">
              <h4>Order Details</h4>
              <p>
                <strong>Order Number:</strong> {order.orderNumber}
              </p>
              <p>
                <strong>Restaurant:</strong> {order.restaurantId?.name}
              </p>
              <p>
                <strong>Delivery Address:</strong>{" "}
                {order.deliveryAddress?.street}
              </p>
              <p>
                <strong>Total:</strong> ${order.totalPrice?.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="cell medium-6">
            <div className="tracking-map-card">
              <h4>Delivery Tracking</h4>
              <MapComponent
                center={
                  order.deliveryLocation?.coordinates
                    ? {
                        lat: order.deliveryLocation.coordinates[1],
                        lng: order.deliveryLocation.coordinates[0],
                      }
                    : null
                }
                markers={[
                  {
                    position: {
                      lat:
                        order.restaurantId?.address?.location?.coordinates[1] ||
                        40.7128,
                      lng:
                        order.restaurantId?.address?.location?.coordinates[0] ||
                        -74.006,
                    },
                    title: order.restaurantId?.name,
                    icon: "/icons/restaurant-marker.png",
                  },
                  ...(driverLocation
                    ? [
                        {
                          position: driverLocation,
                          title: "Your Driver",
                          icon: "/icons/driver-marker.png",
                        },
                      ]
                    : []),
                ]}
                height="300px"
              />
              {driverLocation && (
                <div className="driver-info">
                  <p>Driver is on the way to your location</p>
                  <p>
                    Estimated delivery:{" "}
                    {order.estimatedDelivery
                      ? new Date(order.estimatedDelivery).toLocaleTimeString()
                      : "Calculating..."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
