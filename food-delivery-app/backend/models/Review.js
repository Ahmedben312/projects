const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    foodQuality: {
      type: Number,
      min: 1,
      max: 5,
    },
    deliveryTime: {
      type: Number,
      min: 1,
      max: 5,
    },
    service: {
      type: Number,
      min: 1,
      max: 5,
    },
    isRecommended: {
      type: Boolean,
    },
    photos: [String],
    response: {
      text: String,
      respondedAt: Date,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one review per order
reviewSchema.index({ order: 1 }, { unique: true });

// Index for restaurant reviews
reviewSchema.index({ restaurant: 1, createdAt: -1 });

// Index for customer reviews
reviewSchema.index({ customer: 1, createdAt: -1 });

// Update restaurant rating when a new review is added
reviewSchema.post("save", async function () {
  const Review = this.constructor;

  const stats = await Review.aggregate([
    { $match: { restaurant: this.restaurant } },
    {
      $group: {
        _id: "$restaurant",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    const Restaurant = mongoose.model("Restaurant");
    await Restaurant.findByIdAndUpdate(this.restaurant, {
      rating: parseFloat(stats[0].averageRating.toFixed(1)),
      reviewCount: stats[0].reviewCount,
    });
  }
});

module.exports = mongoose.model("Review", reviewSchema);
