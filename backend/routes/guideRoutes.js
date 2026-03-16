import express from "express";
import {
  createGuide,
  getAllGuides,
  getGuideBySlug,
  getGuideById,
  updateGuide,
  deleteGuide, // 1. Make sure this is imported
} from "../controllers/guideController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Admin/System Routes (Place these ABOVE the slug route) ---
router.get("/id/:id", protect, admin, getGuideById);
router.post("/", protect, admin, createGuide);
router.put("/:id", protect, admin, updateGuide);
router.delete("/:id", protect, admin, deleteGuide); // 2. Added the DELETE route

// --- Public Routes ---
router.get("/", getAllGuides);
router.get("/:slug", getGuideBySlug);

export default router;
