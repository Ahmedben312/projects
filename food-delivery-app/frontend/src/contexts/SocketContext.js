import React, { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [orders, setOrders] = useState({});

  // Mock socket connection for development
  useEffect(() => {
    // Simulate socket connection
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const joinOrderRoom = (orderId) => {
    console.log(`Joining order room: ${orderId}`);
    // In a real app, this would emit a socket event
  };

  const leaveOrderRoom = (orderId) => {
    console.log(`Leaving order room: ${orderId}`);
    // In a real app, this would emit a socket event
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], status },
    }));
  };

  const value = {
    isConnected,
    joinOrderRoom,
    leaveOrderRoom,
    updateOrderStatus,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
