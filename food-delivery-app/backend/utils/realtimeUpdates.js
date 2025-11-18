const socketService = require("../services/socketService");

const emitOrderStatusUpdate = (order) => {
  socketService.emitOrderUpdate(order);
};

const emitDriverLocationUpdate = (orderId, driverId, location) => {
  socketService.emitDriverLocation(orderId, driverId, location);
};

const emitNewOrderNotification = (order) => {
  socketService.emitNewOrder(order);
};

const getConnectedUsers = () => {
  return socketService.getConnectedUsersCount();
};

const isUserOnline = (userId) => {
  return socketService.isUserConnected(userId);
};

const sendNotificationToUser = (userId, notification) => {
  if (isUserOnline(userId)) {
    // Send real-time notification
    socketService.io.to(`user_${userId}`).emit("notification", notification);
    return true;
  }
  return false;
};

const sendNotificationToRestaurant = (restaurantId, notification) => {
  socketService.io
    .to(`restaurant_${restaurantId}`)
    .emit("notification", notification);
};

const sendNotificationToDriver = (driverId, notification) => {
  socketService.io.to(`driver_${driverId}`).emit("notification", notification);
};

module.exports = {
  emitOrderStatusUpdate,
  emitDriverLocationUpdate,
  emitNewOrderNotification,
  getConnectedUsers,
  isUserOnline,
  sendNotificationToUser,
  sendNotificationToRestaurant,
  sendNotificationToDriver,
};
