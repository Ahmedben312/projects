class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(io) {
    this.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // User joins their personal room for private updates
      socket.on("user_join", (userId) => {
        socket.join(`user_${userId}`);
        this.connectedUsers.set(socket.id, userId);
        console.log(`User ${userId} joined their room`);
      });

      // Restaurant staff joins restaurant room
      socket.on("restaurant_join", (restaurantId) => {
        socket.join(`restaurant_${restaurantId}`);
        console.log(`Restaurant ${restaurantId} room joined`);
      });

      // Driver joins their room
      socket.on("driver_join", (driverId) => {
        socket.join(`driver_${driverId}`);
        console.log(`Driver ${driverId} joined their room`);
      });

      // Order tracking room
      socket.on("order_join", (orderId) => {
        socket.join(`order_${orderId}`);
        console.log(`Joined order room: ${orderId}`);
      });

      socket.on("disconnect", () => {
        const userId = this.connectedUsers.get(socket.id);
        if (userId) {
          this.connectedUsers.delete(socket.id);
          console.log(`User ${userId} disconnected`);
        } else {
          console.log("Unknown user disconnected:", socket.id);
        }
      });
    });
  }

  // Emit order update to relevant parties
  emitOrderUpdate(order) {
    if (!this.io) return;

    // Emit to customer
    this.io.to(`user_${order.customerId}`).emit("order_updated", order);

    // Emit to restaurant
    this.io.to(`restaurant_${order.restaurantId}`).emit("order_updated", order);

    // Emit to order room for tracking page
    this.io.to(`order_${order._id}`).emit("order_updated", order);

    // If driver is assigned, emit to driver
    if (order.driverId) {
      this.io.to(`driver_${order.driverId}`).emit("order_updated", order);
    }
  }

  // Emit driver location update
  emitDriverLocation(orderId, driverId, location) {
    if (!this.io) return;

    this.io.to(`order_${orderId}`).emit("driver_location_updated", {
      driverId,
      location,
      timestamp: new Date(),
    });
  }

  // Emit new order notification to restaurant
  emitNewOrder(order) {
    if (!this.io) return;

    this.io.to(`restaurant_${order.restaurantId}`).emit("new_order", order);
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Check if user is connected
  isUserConnected(userId) {
    return Array.from(this.connectedUsers.values()).includes(userId);
  }
}

module.exports = new SocketService();
