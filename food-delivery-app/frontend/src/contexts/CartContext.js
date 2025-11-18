import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  const addToCart = (item, restaurantInfo) => {
    setCartItems((prevItems) => {
      // If adding from a different restaurant, clear cart
      if (restaurant && restaurant._id !== restaurantInfo._id) {
        const confirmClear = window.confirm(
          "You have items from another restaurant in your cart. Would you like to clear the cart and add items from this restaurant?"
        );
        if (confirmClear) {
          setRestaurant(restaurantInfo);
          return [{ ...item, id: Date.now().toString() }];
        } else {
          return prevItems;
        }
      }

      // If first item, set restaurant
      if (prevItems.length === 0) {
        setRestaurant(restaurantInfo);
      }

      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.menuItemId === item.menuItemId
      );

      if (existingItemIndex > -1) {
        // Update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { ...item, id: Date.now().toString() }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));

    // Clear restaurant if cart is empty
    if (cartItems.length === 1) {
      setRestaurant(null);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurant(null);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const deliveryFee = restaurant?.deliveryFee || 2.99;
    const tax = subtotal * 0.08;
    return subtotal + deliveryFee + tax;
  };

  const value = {
    cartItems,
    restaurant,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    getTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
export { CartContext }; // Add this line to export the context
