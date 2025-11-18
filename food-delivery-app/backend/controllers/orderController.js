const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    // Calculate order total
    const restaurant = await Restaurant.findById(req.body.restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    let subtotal = 0;
    const orderItems = [];

    // Calculate prices and validate menu items
    for (const item of req.body.items) {
      const menuItem = restaurant.menu.id(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found: ${item.menuItemId}`,
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Menu item not available: ${menuItem.name}`,
        });
      }

      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItemId: item.menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
      });
    }

    // Calculate totals
    const deliveryFee = restaurant.deliveryFee || 2.99;
    const tax = subtotal * 0.08; // 8% tax
    const totalPrice = subtotal + deliveryFee + tax + (req.body.tip || 0);

    // Create order
    const order = new Order({
      customerId: req.user.id,
      restaurantId: req.body.restaurantId,
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      tip: req.body.tip || 0,
      totalPrice,
      deliveryAddress: req.body.deliveryAddress,
      deliveryLocation: req.body.deliveryLocation,
      paymentMethod: req.body.paymentMethod,
      customerNotes: req.body.customerNotes,
      estimatedDelivery: new Date(Date.now() + 45 * 60000), // 45 minutes from now
    });

    await order.save();
    await order.populate("restaurantId", "name address contact image");

    // Emit real-time update
    const io = req.app.get("io");
    if (io) {
      io.to(`restaurant_${order.restaurantId._id}`).emit("new_order", order);
    }

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for user
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    let query = { customerId: req.user.id };

    // Restaurant owners can see their restaurant's orders
    if (req.user.role === "restaurant_owner") {
      // This would require a Restaurant model relation
      // For now, we'll just return customer orders
    }

    const orders = await Order.find(query)
      .populate("restaurantId", "name address contact image")
      .sort({ placedAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customerId", "name email phone")
      .populate("restaurantId", "name address contact image operatingHours");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user has permission to view this order
    if (
      order.customerId._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Authorization check (restaurant staff or admin)
    if (
      order.restaurantId.toString() !== req.user.restaurantId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this order",
      });
    }

    order.status = status;

    // Set timestamp based on status
    const now = new Date();
    switch (status) {
      case "CONFIRMED":
        order.confirmedAt = now;
        break;
      case "PREPARING":
        order.preparingAt = now;
        break;
      case "READY_FOR_PICKUP":
        order.readyAt = now;
        break;
      case "PICKED_UP":
        order.pickedUpAt = now;
        break;
      case "DELIVERED":
        order.deliveredAt = now;
        break;
    }

    await order.save();

    // Emit real-time update
    const io = req.app.get("io");
    if (io) {
      io.to(`order_${order._id}`).emit("order_updated", order);
      io.to(`restaurant_${order.restaurantId}`).emit("order_updated", order);
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user has permission to cancel this order
    if (
      order.customerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    // Check if order can be cancelled
    if (!["PENDING", "CONFIRMED"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.status = "CANCELLED";
    await order.save();

    // Emit real-time update
    const io = req.app.get("io");
    if (io) {
      io.to(`order_${order._id}`).emit("order_updated", order);
      io.to(`restaurant_${order.restaurantId}`).emit("order_updated", order);
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order tracking information
// @route   GET /api/orders/:id/tracking
// @access  Private
exports.getOrderTracking = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurantId", "name address location")
      .populate("customerId", "name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user has permission to view this order
    if (
      order.customerId._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order",
      });
    }

    // Get driver location (in real app, this would come from driver service)
    const driverLocation = null; // This would be fetched from driver service

    res.json({
      success: true,
      data: {
        order,
        driverLocation,
        estimatedDelivery: order.estimatedDelivery,
        status: order.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
