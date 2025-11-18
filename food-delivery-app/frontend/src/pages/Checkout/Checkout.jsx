import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { orderService } from "../../services/orderService";
import "./Checkout.css";

const Checkout = () => {
  const { cartItems, restaurant, getTotal, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }
    if (!address) {
      setError("Please provide a delivery address");
      return;
    }

    const orderData = {
      restaurantId: restaurant?._id || restaurant?.id,
      items: cartItems.map((i) => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
      })),
      address,
      paymentMethod,
      total: getTotal(),
    };

    try {
      setLoading(true);
      const res = await orderService.createOrder(orderData);
      if (res && res.success) {
        clearCart();
        navigate(`/track-order/${res.data._id || res.data.id}`);
      } else {
        setError(res.message || "Failed to place order");
      }
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page checkout">
      <h1>Checkout</h1>
      <div className="checkout-grid">
        <div className="checkout-form">
          <label>
            Delivery Address
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <label>
            Payment Method
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="card">Card</option>
              <option value="cash">Cash</option>
            </select>
          </label>
          <button
            className="btn btn-primary"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Placing order..." : "Place Order"}
          </button>
          {error && <p className="error">{error}</p>}
        </div>

        <aside className="checkout-summary">
          <h3>Order Summary</h3>
          <ul>
            {cartItems.map((c) => (
              <li key={c.id || c.menuItemId}>
                {c.name} x {c.quantity} — ${(c.price * c.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="total">Total: ${getTotal().toFixed(2)}</p>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
