const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const redis = require("redis");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// Import models with correct paths
const User = require("./models/User");
const Post = require("./models/Post");
const Notification = require("./models/Notification");

// Import middleware
const auth = require("./middleware/auth");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const uploadRoutes = require("./routes/upload");
const chatRoutes = require("./routes/chat");
const notificationRoutes = require("./routes/notifications");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Serve uploaded files statically when using local storage
if (process.env.STORAGE_TYPE !== "cloud") {
  app.use("/uploads", express.static("uploads"));
}

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

// Socket.io for real-time features
const setupChatSocket = require("./sockets/chat");
const setupNotificationSocket = require("./sockets/notifications");

// Initialize sockets after Redis connection
const initializeSockets = async () => {
  try {
    await redisClient.connect();
    console.log("Redis Client Connected");

    setupChatSocket(io, redisClient);
    setupNotificationSocket(io);

    console.log("Socket handlers initialized");
  } catch (error) {
    console.error("Failed to initialize sockets:", error);
  }
};

initializeSockets();

// Store io instance in app for access in routes
app.set("io", io);

// Error handling middleware
app.use(require("./middleware/error"));

// Basic health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    redis: redisClient.isOpen ? "connected" : "disconnected",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
