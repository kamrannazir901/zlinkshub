import express from "express";
const router = express.Router();
import {
  testAmazonConnection,
  getPublicLink,
  generateLink,
  getUserLinks,
  deleteLink,
  getAllPublicLinks,
  listReports,
  getReport,
} from "../controllers/linkController.js";
import { protect } from "../middleware/authMiddleware.js";

// Public route for the product landing page
router.get("/products/feed", getAllPublicLinks);
router.get("/product/:id", getPublicLink);
router.get("/test-connection", testAmazonConnection);
router.get("/reports", listReports);
router.post("/reports/download", getReport);

// Protected routes (require login)
router.use(protect);
router.post("/generate", generateLink);
router.get("/", getUserLinks);
router.delete("/:id", deleteLink);

export default router;
