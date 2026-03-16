import express from "express";
import multer from "multer";
import {
  uploadEarningsCSV,
  clearEarnings,
  getReports,
  getUserReports,
} from "../controllers/reportController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import SaleDetail from "../models/SaleDetail.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// These paths will be prefixed by "/api/reports" in app.js
router.post(
  "/upload",
  protect,
  admin,
  upload.single("file"),
  uploadEarningsCSV,
);
router.delete("/clear", protect, admin, clearEarnings);
// --- TESTING UTILITY: Quick clear all ---
router.delete("/clear-all", protect, admin, async (req, res) => {
  try {
    // Clear all records from your main sale collection
    await SaleDetail.deleteMany({});

    // If you add other collections later, add them here:
    // await YourOtherModel.deleteMany({});

    res.json({
      message: "Database cleared: All sale details have been removed.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to clear database: " + error.message });
  }
});
router.get("/", protect, getReports);

router.get("/my-earnings", protect, getUserReports);

export default router;
