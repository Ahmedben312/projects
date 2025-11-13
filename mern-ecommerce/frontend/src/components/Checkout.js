import React from "react";
import { useSelector } from "react-redux";

const Checkout = () => {
  const { total } = useSelector((state) => state.cart);
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <div className="bg-white rounded shadow p-4 max-w-md mx-auto">
        <p>Total: ${total.toFixed(2)}</p>
        <p>Redirected from Stripe - Payment processed!</p>
      </div>
    </div>
  );
};

export default Checkout;
