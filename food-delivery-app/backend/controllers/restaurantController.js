const Restaurant = require("../models/Restaurant");

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = async (req, res, next) => {
  try {
    const {
      city,
      cuisine,
      minRating,
      deliveryTime,
      page = 1,
      limit = 10,
      sortBy = "rating",
      sortOrder = "desc",
    } = req.query;

    let query = { isActive: true };

    // Filter by city
    if (city) {
      query["address.city"] = new RegExp(city, "i");
    }

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = new RegExp(cuisine, "i");
    }

    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Filter by delivery time
    if (deliveryTime) {
      query.deliveryTime = { $lte: deliveryTime };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const restaurants = await Restaurant.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-menu"); // Don't include full menu in list

    const total = await Restaurant.countDocuments(query);

    res.json({
      success: true,
      count: restaurants.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby restaurants
// @route   GET /api/restaurants/nearby
// @access  Public
exports.getNearbyRestaurants = async (req, res, next) => {
  try {
    const { latitude, longitude, maxDistance = 5000 } = req.query; // maxDistance in meters

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const restaurants = await Restaurant.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    }).limit(20);

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search restaurants
// @route   GET /api/restaurants/search
// @access  Public
exports.searchRestaurants = async (req, res, next) => {
  try {
    const { q, city, cuisine } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    let query = {
      isActive: true,
      $or: [
        { name: new RegExp(q, "i") },
        { "menu.name": new RegExp(q, "i") },
        { cuisine: new RegExp(q, "i") },
      ],
    };

    if (city) {
      query["address.city"] = new RegExp(city, "i");
    }

    if (cuisine) {
      query.cuisine = new RegExp(cuisine, "i");
    }

    const restaurants = await Restaurant.find(query)
      .limit(20)
      .select("name cuisine address rating deliveryTime image");

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get restaurant menu
// @route   GET /api/restaurants/:id/menu
// @access  Public
exports.getRestaurantMenu = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).select(
      "name menu operatingHours"
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Filter out unavailable items
    const availableMenu = restaurant.menu.filter((item) => item.isAvailable);

    res.json({
      success: true,
      data: {
        restaurant: {
          name: restaurant.name,
          operatingHours: restaurant.operatingHours,
        },
        menu: availableMenu,
      },
    });
  } catch (error) {
    next(error);
  }
};
