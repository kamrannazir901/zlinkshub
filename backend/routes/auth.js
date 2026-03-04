import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  contactForm,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/contact", contactForm);
export default router;
