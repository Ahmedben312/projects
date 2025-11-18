import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // derive socket base url from API url, strip any trailing /api
      const rawApi =
        process.env.REACT_APP_API_URL || "http://localhost:8000/api";
      const socketUrl = rawApi.replace(/\/api\/?$/, "");

      const newSocket = io(socketUrl, {
        transports: ["websocket"],
      });

      newSocket.on("connect", () => {
        setIsConnected(true);
        console.log("Connected to server");

        // Join user room - use _id if present
        const userId = user._id || user.id;
        if (userId) newSocket.emit("user_join", userId);
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
        console.log("Disconnected from server");
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user]);

  const joinOrderRoom = (orderId) => {
    if (socket && isConnected) {
      socket.emit("order_join", orderId);
    }
  };

  const leaveOrderRoom = (orderId) => {
    if (socket && isConnected) {
      // client cannot directly leave server-side rooms; emit an intent to leave
      socket.emit("order_leave", orderId);
    }
  };

  const value = {
    socket,
    isConnected,
    joinOrderRoom,
    leaveOrderRoom,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
