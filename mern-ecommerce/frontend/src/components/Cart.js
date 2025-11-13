import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../slices/cartSlice";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const { data } = await axios.post("/api/orders/checkout", {
        items,
        total,
      });
      window.location.href = data.url;
    } catch (err) {
      alert("Checkout failed. Please login and try again.");
    }
  };

  if (items.length === 0) {
    return <div className="p-4 text-center">Your cart is empty</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      <div className="bg-white rounded shadow">
        {items.map((item) => (
          <div key={item._id} className="flex justify-between p-4 border-b">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p>${item.price}</p>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  dispatch(
                    updateQuantity({
                      id: item._id,
                      quantity: parseInt(e.target.value) || 1,
                    })
                  )
                }
                className="w-16 p-1 border rounded mr-2"
              />
              <p className="mr-4">${(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => dispatch(removeFromCart(item._id))}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="p-4 text-right">
          <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
          <button
            onClick={handleCheckout}
            className="mt-4 bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600"
          >
            Checkout with Stripe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
