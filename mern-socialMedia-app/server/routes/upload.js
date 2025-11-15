const express = require("express");
const upload = require("../utils/storage");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload file
router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let fileUrl;

    if (process.env.STORAGE_TYPE === "cloud") {
      // Cloudinary returns secure_url
      fileUrl = req.file.path;
    } else {
      // Local storage - construct URL
      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    res.json({
      success: true,
      file: {
        url: fileUrl,
        type: req.file.mimetype.split("/")[0], // 'image', 'video', etc.
        filename: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple files
router.post("/multiple", auth, upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files.map((file) => {
      let fileUrl;

      if (process.env.STORAGE_TYPE === "cloud") {
        fileUrl = file.path;
      } else {
        fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
          file.filename
        }`;
      }

      return {
        url: fileUrl,
        type: file.mimetype.split("/")[0],
        filename: file.originalname,
        size: file.size,
      };
    });

    res.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
