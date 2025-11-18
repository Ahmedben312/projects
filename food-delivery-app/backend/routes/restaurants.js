const express = require("express");
const {
  getRestaurants,
  getRestaurant,
  getNearbyRestaurants,
  searchRestaurants,
  getRestaurantMenu,
} = require("../controllers/restaurantController");
const { optionalAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", optionalAuth, getRestaurants);
router.get("/nearby", optionalAuth, getNearbyRestaurants);
router.get("/search", optionalAuth, searchRestaurants);
router.get("/:id", optionalAuth, getRestaurant);
router.get("/:id/menu", optionalAuth, getRestaurantMenu);

module.exports = router;
