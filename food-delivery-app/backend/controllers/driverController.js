const Driver = require("../models/Driver");

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Public
exports.getDrivers = async (req, res, next) => {
  try {
    const { city, status } = req.query;
    let query = { isActive: true };

    if (city) query.city = city;
    if (status) query.status = status;

    const drivers = await Driver.find(query).select("-__v");

    res.json({
      success: true,
      count: drivers.length,
      data: drivers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single driver
// @route   GET /api/drivers/:id
// @access  Public
exports.getDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({
      $or: [{ _id: req.params.id }, { driverId: req.params.id }],
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.json({
      success: true,
      data: driver,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update driver location
// @route   PUT /api/drivers/:id/location
// @access  Private
exports.updateDriverLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    const driver = await Driver.findOneAndUpdate(
      {
        $or: [{ _id: req.params.id }, { driverId: req.params.id }],
      },
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        lastActive: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Emit real-time location update
    const io = req.app.get("io");
    if (io && driver.currentOrder) {
      io.to(`order_${driver.currentOrder}`).emit("driver_location_updated", {
        driverId: driver.driverId,
        location: driver.location,
        orderId: driver.currentOrder,
      });
    }

    res.json({
      success: true,
      data: driver,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby drivers
// @route   GET /api/drivers/nearby
// @access  Public
exports.getNearbyDrivers = async (req, res, next) => {
  try {
    const { latitude, longitude, maxDistance = 5000 } = req.query; // maxDistance in meters

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const drivers = await Driver.find({
      status: "AVAILABLE",
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
    }).limit(10);

    res.json({
      success: true,
      count: drivers.length,
      data: drivers,
    });
  } catch (error) {
    next(error);
  }
};
