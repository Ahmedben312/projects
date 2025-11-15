const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/time-logs", require("./routes/timeLogs"));
app.use("/api/files", require("./routes/files"));
app.use("/api/analytics", require("./routes/analytics"));

// MongoDB Connection
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/project-management",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Socket.io for real-time collaboration
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-project", (projectId) => {
    socket.join(projectId);
    console.log(`User ${socket.id} joined project ${projectId}`);
  });

  socket.on("task-updated", (data) => {
    socket.to(data.projectId).emit("task-updated", data);
  });

  socket.on("task-created", (data) => {
    socket.to(data.projectId).emit("task-created", data);
  });

  socket.on("task-deleted", (data) => {
    socket.to(data.projectId).emit("task-deleted", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
