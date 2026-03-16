import fs from "fs";
import { parse } from "csv-parse";
import SaleDetail from "../models/SaleDetail.js";
import TrackingTag from "../models/TrackingTag.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const uploadEarningsCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const {
    apiAccountId,
    reportStartDate,
    reportEndDate,
    conversionRate,
    currency,
  } = req.body;
  const rate = parseFloat(conversionRate) || 1;
  const results = [];
  const trackingIdsFound = new Set();

  const parser = fs.createReadStream(req.file.path).pipe(
    parse({
      skip_empty_lines: true,
      relax_column_count: true,
      relax_quotes: true,
      from_line: 3, // Skips header and metadata
    }),
  );

  for await (const row of parser) {
    if (!row[4] || row[4].trim() === "") continue;
    trackingIdsFound.add(row[4]);

    // Strip time for DateShipped
    const date = new Date(row[5]);
    date.setHours(0, 0, 0, 0);

    results.push({
      apiAccount: apiAccountId,
      trackingId: row[4],
      asin: row[2],
      dateShipped: date,
      reportStartDate: new Date(reportStartDate),
      reportEndDate: new Date(reportEndDate),
      itemsShipped: parseInt(row[7]) || 0,
      isReturn: row[8] === "1",
      currency: currency || "USD",
      conversionRate: rate,
      adFeesOriginal: parseFloat(row[10]) || 0,
      adFees: (parseFloat(row[10]) || 0) * rate,
      revenueOriginal: parseFloat(row[9]) || 0,
      revenue: (parseFloat(row[9]) || 0) * rate,
    });
  }

  try {
    const deleteQuery = {
      apiAccount: apiAccountId,
      reportStartDate: new Date(reportStartDate),
      reportEndDate: new Date(reportEndDate),
    };

    const deleted = await SaleDetail.deleteMany(deleteQuery);
    console.log(`Cleared ${deleted.deletedCount} old records for this range.`);
    // 1. Efficiently map tracking tags
    const tags = await TrackingTag.find({
      tag: { $in: Array.from(trackingIdsFound) },
      // apiAccount: apiAccountId,
    });
    const tagMap = new Map(tags.map((t) => [t.tag, t._id]));

    // 2. Attach tag IDs to results
    const finalResults = results.map((item) => ({
      ...item,
      trackingTag: tagMap.get(item.trackingId) || null,
    }));

    // 3. Batch insert
    await SaleDetail.insertMany(finalResults);

    fs.unlinkSync(req.file.path);
    res.json({ message: `Successfully saved ${finalResults.length} records.` });
  } catch (err) {
    console.error("Database Error:", err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "DB Save failed", details: err.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      trackingId,
      apiAccountId,
      page = 1,
      limit = 10,
    } = req.query;

    if (!startDate || !endDate)
      return res
        .status(400)
        .json({ error: "Start date and End date are required." });

    // ... inside getReports
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set to the very end of the day

    let query = {
      dateShipped: {
        $gte: start,
        $lte: end,
      },
    };

    // conver to object id

    if (apiAccountId) {
      query.apiAccount = new mongoose.Types.ObjectId(apiAccountId);
    }
    if (trackingId && trackingId !== "all") {
      // Splits by commas or spaces, removes whitespace, and ignores empty strings
      const idsArray = trackingId
        .split(/[,\s]+/)
        .filter((id) => id.trim() !== "");
      if (idsArray.length > 0) {
        query.trackingId = { $in: idsArray };
      }
    }
    // Aggregation pipeline to calculate total ad fees
    const summary = await SaleDetail.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAdFees: {
            $sum: {
              $cond: [
                { $gt: [{ $ifNull: ["$adFees", 0] }, 0] },
                { $ifNull: ["$adFees", 0] },
                0,
              ],
            },
          },
        },
      },
    ]);

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { dateShipped: -1 },
      populate: "trackingTag",
      lean: true,
    };

    const result = await SaleDetail.paginate(query, options);

    res.json({
      reports: result.docs,
      totalDocs: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
      summary: summary.length > 0 ? summary[0].totalAdFees : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// --- CLEAR PERIOD ---

// backend/controllers/reportController.js
export const clearEarnings = async (req, res) => {
  try {
    const { startDate, endDate, apiAccountId, trackingId } = req.body;

    let query = {};

    // 1. Critical: Convert apiAccountId to ObjectId
    if (apiAccountId) {
      query.apiAccount = new mongoose.Types.ObjectId(apiAccountId);
    }

    // 2. Critical: Normalize Dates to cover the full 24-hour range
    if (startDate || endDate) {
      query.dateShipped = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.dateShipped.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.dateShipped.$lte = end;
      }
    }

    if (trackingId) query.trackingId = trackingId;

    // Safety check
    if (Object.keys(query).length === 0) {
      return res.status(400).json({
        error: "At least one filter is required to prevent mass deletion.",
      });
    }

    console.log("DANGER - Executing Clear Query:", JSON.stringify(query));

    const result = await SaleDetail.deleteMany(query);

    res.json({
      message: `Successfully cleared ${result.deletedCount} records.`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserReports = async (req, res) => {
  try {
    let { startDate, userId, endDate, page = 1, limit = 10 } = req.query;

    let targetUserId = req.user._id;
    if (
      req.user.role === "admin" &&
      userId &&
      mongoose.Types.ObjectId.isValid(userId)
    ) {
      targetUserId = new mongoose.Types.ObjectId(userId);
    }

    const targetUserName = await User.findById(targetUserId).select("name");

    // 1. Default Date Handler (Last Month)
    if (!startDate || !endDate) {
      const now = new Date();
      const firstDayOfCurrentMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      );
      const lastDayOfPrevMonth = new Date(firstDayOfCurrentMonth - 1);
      const firstDayOfPrevMonth = new Date(
        lastDayOfPrevMonth.getFullYear(),
        lastDayOfPrevMonth.getMonth(),
        1,
      );

      startDate = firstDayOfPrevMonth.toISOString();
      endDate = lastDayOfPrevMonth.toISOString();
    }

    // --- Date Normalization ---
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Ensure full day coverage

    // 2. Find tags associated with this user
    const userTags = await TrackingTag.find({ user: targetUserId }).select(
      "_id tag",
    );
    const tagIds = userTags.map((t) => t._id);

    if (tagIds.length === 0) {
      return res.json({
        reports: [],
        totalDocs: 0,
        page: 1,
        totalPages: 0,
        summary: 0,
        userName: targetUserName ? targetUserName.name : req.user.name,
      });
    }

    // 3. Define query
    const query = {
      trackingTag: { $in: tagIds },
      dateShipped: { $gte: start, $lte: end },
    };

    // 4. Aggregation: Sum ad fees
    const summary = await SaleDetail.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAdFees: {
            $sum: {
              $cond: [
                { $gt: [{ $ifNull: ["$adFees", 0] }, 0] },
                { $ifNull: ["$adFees", 0] },
                0,
              ],
            },
          },
        },
      },
    ]);

    // 5. Pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { dateShipped: -1 },
      populate: "trackingTag",
      lean: true,
    };

    const result = await SaleDetail.paginate(query, options);

    res.json({
      reports: result.docs,
      totalDocs: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
      summary: summary.length > 0 ? summary[0].totalAdFees : 0,
      userName: targetUserName ? targetUserName.name : req.user.name,
    });
  } catch (error) {
    console.error("Report Controller Error:", error);
    res.status(500).json({ error: "Could not retrieve your earnings." });
  }
};
