import express from "express";
import {
  createReport,
  checkReportStatus,
  getReportData,
  listReports,
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/create", createReport); // Step 1
router.get("/status/:reportId", checkReportStatus); // Step 2
router.get("/data/:reportDocumentId", getReportData); // Step 3
router.get("/list", listReports); // list all reports

export default router;
