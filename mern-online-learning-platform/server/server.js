import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import progressRoutes from "./routes/progress.js";
import certificateRoutes from "./routes/certificates.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body parser middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Enable CORS
app.use(cors());

// Set static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/certificates", certificateRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to MERN LMS API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      courses: "/api/courses",
      progress: "/api/progress",
      certificates: "/api/certificates",
    },
  });
});

// Handle undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    success: false,
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? error.message : {},
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
});
