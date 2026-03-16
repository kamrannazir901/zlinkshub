import express from "express";
const router = express.Router();
import {
  testAmazonConnection,
  getPublicLink,
  generateLink,
  getUserLinks,
  deleteLink,
  getAllPublicLinks,
} from "../controllers/linkController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// Public route for the product landing page
router.get("/products/feed", getAllPublicLinks);
router.get("/product/:id", getPublicLink);
router.get("/test-connection", testAmazonConnection);

// Protected routes (require login)
router.use(protect);
router.post("/generate", generateLink);
router.get("/", getUserLinks);
router.delete("/:id", protect, admin, deleteLink);

export default router;
