import { sampleOrder } from "../mock/data";

// Mock service for orders
export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate a random order ID
    const orderId = "order_" + Math.random().toString(36).substr(2, 9);

    const newOrder = {
      _id: orderId,
      ...orderData,
      status: "pending",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString(), // 45 minutes from now
      updates: ["Order received"],
    };

    // Save to localStorage for persistence during development
    const orders = JSON.parse(localStorage.getItem("userOrders") || "[]");
    orders.push(newOrder);
    localStorage.setItem("userOrders", JSON.stringify(orders));

    return { data: newOrder };
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Try to get from localStorage first, then fall back to sample
    const orders = JSON.parse(localStorage.getItem("userOrders") || "[]");
    const order = orders.find((o) => o._id === orderId) || sampleOrder;

    if (!order) {
      throw new Error("Order not found");
    }

    return { data: order };
  },

  // Get user's order history
  getUserOrders: async (userId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const orders = JSON.parse(localStorage.getItem("userOrders") || "[]");
    const userOrders = orders.filter((order) => order.userId === userId);

    return { data: userOrders };
  },

  // Update order status
  updateOrderStatus: async (orderId, status, updateMessage) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const orders = JSON.parse(localStorage.getItem("userOrders") || "[]");
    const orderIndex = orders.findIndex((o) => o._id === orderId);

    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      if (updateMessage) {
        orders[orderIndex].updates = orders[orderIndex].updates || [];
        orders[orderIndex].updates.push(updateMessage);
      }
      localStorage.setItem("userOrders", JSON.stringify(orders));
    }

    return { data: { success: true } };
  },
};

export default orderService;
