const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    driverId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    vehicle: {
      type: {
        type: String,
        enum: ["car", "motorcycle", "bicycle", "scooter"],
        required: true,
      },
      make: String,
      model: String,
      color: String,
      licensePlate: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    city: {
      type: String,
      enum: ["Sfax", "NYC"],
      required: true,
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "ASSIGNED", "BUSY", "OFFLINE"],
      default: "OFFLINE",
    },
    currentOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

driverSchema.index({ location: "2dsphere" });
driverSchema.index({ driverId: 1 });
driverSchema.index({ city: 1, status: 1 });

module.exports = mongoose.model("Driver", driverSchema);
