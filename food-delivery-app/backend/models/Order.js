const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant.menu" },
  name: String,
  price: Number,
  quantity: { type: Number, required: true },
  specialInstructions: String,
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  driverId: String,
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  tip: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  deliveryLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  status: {
    type: String,
    enum: [
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "READY_FOR_PICKUP",
      "PICKED_UP",
      "ON_THE_WAY",
      "DELIVERED",
      "CANCELLED",
    ],
    default: "PENDING",
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
    default: "PENDING",
  },
  paymentMethod: String,
  placedAt: { type: Date, default: Date.now },
  confirmedAt: Date,
  preparingAt: Date,
  readyAt: Date,
  pickedUpAt: Date,
  deliveredAt: Date,
  estimatedDelivery: Date,
  customerNotes: String,
  restaurantNotes: String,
});

orderSchema.index({ deliveryLocation: "2dsphere" });

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD${(count + 1).toString().padStart(6, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
