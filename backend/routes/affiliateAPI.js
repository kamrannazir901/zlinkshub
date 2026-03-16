import express from "express";
import {
  addAPIAccount,
  getAllAPIAccounts,
  deleteAPIAccount,
  getAPIAccountsPaginated,
} from "../controllers/affiliateAPIController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(admin);

router.get("/paginated", getAPIAccountsPaginated);
router.post("/", addAPIAccount);
router.get("/", getAllAPIAccounts);
router.delete("/:id", deleteAPIAccount);

export default router;
