const setupNotificationSocket = (io) => {
  const notificationNamespace = io.of("/notifications");

  notificationNamespace.on("connection", (socket) => {
    console.log("User connected to notifications:", socket.id);

    // Join user to their personal notification room
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined notifications`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected from notifications:", socket.id);
    });
  });

  return notificationNamespace;
};

module.exports = setupNotificationSocket;
