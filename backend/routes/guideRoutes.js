import express from "express";
import {
  createGuide,
  getAllGuides,
  getGuideBySlug,
  getGuideById,
  updateGuide,
  deleteGuide, // 1. Make sure this is imported
} from "../controllers/guideController.js";

const router = express.Router();

// --- Admin/System Routes (Place these ABOVE the slug route) ---
router.get("/id/:id", getGuideById);
router.post("/", createGuide);
router.put("/:id", updateGuide);
router.delete("/:id", deleteGuide); // 2. Added the DELETE route

// --- Public Routes ---
router.get("/", getAllGuides);
router.get("/:slug", getGuideBySlug);

export default router;
