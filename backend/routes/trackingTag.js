import express from "express";
import {
  addTag,
  getAllTags,
  getTagById,
  deleteTag,
  searchTags,
} from "../controllers/trackingTagController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);
router.use(admin);

router.post("/", addTag);
router.get("/", getAllTags);
router.get("/search", searchTags);
router.get("/:id", getTagById);
router.delete("/:id", deleteTag);

export default router;
