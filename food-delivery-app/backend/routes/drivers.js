const express = require("express");
const {
  getDrivers,
  getDriver,
  updateDriverLocation,
  getNearbyDrivers,
} = require("../controllers/driverController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", getDrivers);
router.get("/nearby", getNearbyDrivers);
router.get("/:id", getDriver);
router.put("/:id/location", auth, updateDriverLocation);

module.exports = router;
