const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/fooddelivery"
);

// Socket.io for real-time updates
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_order_room", (orderId) => {
    socket.join(orderId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible to our routes
app.set("io", io);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/restaurants", require("./routes/restaurants"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));
app.use("/api/drivers", require("./routes/drivers"));

// Error handling middleware
app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 8001;

// Bind to localhost to avoid permission issues.
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on port ${PORT}`);
});
