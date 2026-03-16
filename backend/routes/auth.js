import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  contactForm,
} from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", protect, admin, registerUser);
router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/contact", contactForm);
export default router;
