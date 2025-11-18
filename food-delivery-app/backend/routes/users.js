const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  deleteUserAddress,
  getUserOrders,
} = require("../controllers/userController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.use(auth);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.post("/addresses", addUserAddress);
router.delete("/addresses/:addressId", deleteUserAddress);
router.get("/orders", getUserOrders);

module.exports = router;
