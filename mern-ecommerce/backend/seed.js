require("dotenv").config(); // Load .env vars
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./db");
const User = require("./models/User");
const Product = require("./models/Product");
const Review = require("./models/Review");
const Order = require("./models/Order");

connectDB();

async function seed() {
  try {
    // Check if MONGO_URI is set
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI not found in .env! Add: MONGO_URI=mongodb://127.0.0.1:27017/ecommerce"
      );
    }
    console.log(
      "Connecting with URI:",
      process.env.MONGO_URI.substring(0, 20) + "..."
    ); // Partial log for verification

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    console.log("Cleared existing data.");

    // 1. Seed Mock Users
    const users = await User.insertMany([
      {
        name: "John Doe",
        email: "user1@example.com",
        password: "password123", // Will be hashed
      },
      {
        name: "Jane Smith",
        email: "user2@example.com",
        password: "password123",
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "adminpass",
        isAdmin: true,
      },
    ]);
    console.log(`Seeded ${users.length} users.`);

    // 2. Seed Mock Products
    const products = await Product.insertMany([
      {
        name: "Gaming Laptop",
        description: "High-performance laptop for gamers",
        price: 999.99,
        category: "Electronics",
        image:
          "https://via.placeholder.com/300x200/4A90E2/white?text=Gaming+Laptop",
      },
      {
        name: "Cotton T-Shirt",
        description: "Comfortable everyday t-shirt",
        price: 19.99,
        category: "Clothing",
        image:
          "https://via.placeholder.com/300x200/7ED321/white?text=Cotton+T-Shirt",
      },
      {
        name: "Wireless Headphones",
        description: "Noise-cancelling over-ear headphones",
        price: 149.99,
        category: "Electronics",
        image:
          "https://via.placeholder.com/300x200/F5A623/white?text=Headphones",
      },
      {
        name: "Running Shoes",
        description: "Lightweight shoes for runners",
        price: 89.99,
        category: "Clothing",
        image:
          "https://via.placeholder.com/300x200/50E3C2/white?text=Running+Shoes",
      },
      {
        name: "Python Programming Book",
        description: "Beginner guide to Python",
        price: 29.99,
        category: "Books",
        image:
          "https://via.placeholder.com/300x200/9B59B6/white?text=Python+Book",
      },
      {
        name: "Coffee Mug",
        description: "Ceramic mug for coffee lovers",
        price: 12.99,
        category: "Home",
        image:
          "https://via.placeholder.com/300x200/E74C3C/white?text=Coffee+Mug",
      },
    ]);
    console.log(`Seeded ${products.length} products.`);

    // 3. Seed Mock Reviews (linked to products/users)
    const reviews = await Review.insertMany([
      {
        product: products[0]._id, // Gaming Laptop
        user: users[0]._id, // John
        rating: 5,
        comment: "Amazing performance, worth every penny!",
      },
      {
        product: products[0]._id,
        user: users[1]._id, // Jane
        rating: 4,
        comment: "Great for gaming, but battery life could be better.",
      },
      {
        product: products[1]._id, // T-Shirt
        user: users[0]._id,
        rating: 5,
        comment: "Super comfy and fits perfectly.",
      },
      {
        product: products[2]._id, // Headphones
        user: users[1]._id,
        rating: 3,
        comment: "Good sound, but not fully noise-cancelling.",
      },
      {
        product: products[4]._id, // Book
        user: users[2]._id, // Admin
        rating: 4,
        comment: "Solid intro to Python, some examples outdated.",
      },
    ]);
    console.log(`Seeded ${reviews.length} reviews.`);

    // 4. Seed Mock Orders (linked to users/products)
    const orders = await Order.insertMany([
      {
        user: users[0]._id, // John
        items: [
          {
            product: products[0]._id, // Laptop
            quantity: 1,
            price: 999.99,
            name: "Gaming Laptop",
          },
          {
            product: products[1]._id, // T-Shirt
            quantity: 2,
            price: 19.99,
            name: "Cotton T-Shirt",
          },
        ],
        total: 1039.97, // 999.99 + (19.99 * 2)
        status: "paid",
      },
      {
        user: users[1]._id, // Jane
        items: [
          {
            product: products[2]._id, // Headphones
            quantity: 1,
            price: 149.99,
            name: "Wireless Headphones",
          },
        ],
        total: 149.99,
        status: "pending",
      },
    ]);
    console.log(`Seeded ${orders.length} orders.`);

    // 5. Link reviews to products (populate array)
    for (let review of reviews) {
      await Product.findByIdAndUpdate(review.product, {
        $push: { reviews: review._id },
      });
    }
    console.log("Linked reviews to products.");

    console.log("Full seeding complete! Test credentials:");
    console.log("- User1: user1@example.com / password123");
    console.log("- User2: user2@example.com / password123");
    console.log("- Admin: admin@example.com / adminpass");
  } catch (err) {
    console.error("Seeding error:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

seed();
