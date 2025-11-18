const User = require("../models/User");
const Order = require("../models/Order");

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      avatar: req.body.avatar,
      preferences: req.body.preferences,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add user address
// @route   POST /api/users/addresses
// @access  Private
exports.addUserAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const newAddress = {
      label: req.body.label,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      country: req.body.country || "USA",
      location: req.body.location,
      isDefault: req.body.isDefault || false,
    };

    await user.addAddress(newAddress);

    res.status(201).json({
      success: true,
      data: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
exports.deleteUserAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.addressId
    );

    // If we deleted the default address and there are other addresses, set a new default
    if (
      user.addresses.length > 0 &&
      !user.addresses.some((addr) => addr.isDefault)
    ) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      data: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/users/orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let query = { customerId: req.user.id };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("restaurantId", "name address contact image")
      .sort({ placedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
