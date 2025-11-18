const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

const validateUserRegistration = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Please include a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  handleValidationErrors,
];

const validateUserLogin = [
  body("email").isEmail().withMessage("Please include a valid email"),
  body("password").exists().withMessage("Password is required"),
  handleValidationErrors,
];

const validateOrder = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),
  body("deliveryAddress.street")
    .notEmpty()
    .withMessage("Delivery street address is required"),
  body("deliveryAddress.city")
    .notEmpty()
    .withMessage("Delivery city is required"),
  handleValidationErrors,
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateOrder,
  handleValidationErrors,
};
