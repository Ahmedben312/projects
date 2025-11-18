import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../../services/orderService";
import "./TrackOrder.scss";

const TrackOrder = () => {
  const { orderId } = useParams();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrderTracking(orderId);
        if (res && res.success) {
          setTracking(res.data);
        } else {
          setError(res.message || "Failed to load tracking");
        }
      } catch (err) {
        setError(err.message || "Failed to load tracking");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchTracking();
  }, [orderId]);

  if (loading)
    return <div className="page track-order">Loading tracking info...</div>;
  if (error) return <div className="page track-order">Error: {error}</div>;
  if (!tracking)
    return (
      <div className="page track-order">No tracking information available.</div>
    );

  return (
    <div className="page track-order">
      <h1>Order #{tracking._id || orderId}</h1>
      <p>
        Status: <strong>{tracking.status}</strong>
      </p>
      {tracking.driver && (
        <div className="driver">
          <h3>Driver</h3>
          <p>{tracking.driver.name}</p>
          {tracking.driver.location && (
            <p>
              Location: {tracking.driver.location.latitude},{" "}
              {tracking.driver.location.longitude}
            </p>
          )}
        </div>
      )}
      <section className="updates">
        <h3>Updates</h3>
        <ul>
          {(tracking.updates || []).map((u, i) => (
            <li key={i}>{u}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default TrackOrder;
