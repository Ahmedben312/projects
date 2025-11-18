const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  image: String,
  ingredients: [String],
  preparationTime: Number,
  isAvailable: { type: Boolean, default: true },
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  description: String,
  address: {
    street: String,
    city: { type: String, enum: ["Sfax", "NYC"], required: true },
    state: String,
    zipCode: String,
    country: String,
  },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  contact: {
    phone: String,
    email: String,
  },
  operatingHours: {
    opening: String,
    closing: String,
    timezone: String,
  },
  menu: [menuItemSchema],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 2.99 },
  minimumOrder: { type: Number, default: 0 },
  deliveryTime: String,
  image: String,
  isActive: { type: Boolean, default: true },
});

restaurantSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Restaurant", restaurantSchema);
