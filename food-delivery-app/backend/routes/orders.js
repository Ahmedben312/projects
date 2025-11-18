const express = require("express");
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderTracking,
} = require("../controllers/orderController");
const { auth } = require("../middleware/auth");
const { validateOrder } = require("../middleware/validation");

const router = express.Router();

router.use(auth);

router.post("/", validateOrder, createOrder);
router.get("/", getOrders);
router.get("/:id", getOrder);
router.get("/:id/tracking", getOrderTracking);
router.put("/:id/status", updateOrderStatus);
router.put("/:id/cancel", cancelOrder);

module.exports = router;
