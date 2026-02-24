import express from "express";
import {
  addAPIAccount,
  getAllAPIAccounts,
  deleteAPIAccount, // Import the new method
} from "../controllers/affiliateAPIController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(admin);

router.post("/", addAPIAccount);
router.get("/", getAllAPIAccounts);
router.delete("/:id", deleteAPIAccount);

export default router;
