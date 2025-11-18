const express = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
} = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../middleware/validation");

const router = express.Router();

router.post("/register", validateUserRegistration, register);
router.post("/login", validateUserLogin, login);
router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);
router.put("/password", auth, updatePassword);

module.exports = router;
