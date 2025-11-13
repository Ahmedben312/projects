const express = require("express");
const { uploadImage } = require("../controllers/uploadController");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, upload.single("image"), uploadImage);

module.exports = router;
