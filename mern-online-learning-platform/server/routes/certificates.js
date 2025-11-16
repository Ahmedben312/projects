import express from "express";
import {
  generateCertificate,
  getMyCertificates,
} from "../controllers/certificateController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/generate", protect, generateCertificate);
router.get("/my-certificates", protect, getMyCertificates);

export default router;
