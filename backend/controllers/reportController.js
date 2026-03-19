import fs from "fs";
import { parse } from "csv-parse";
import SaleDetail from "../models/SaleDetail.js";
import TrackingTag from "../models/TrackingTag.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const uploadEarningsCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const { apiAccountId, year, month, conversionRate, currency } = req.body;

  const rate = parseFloat(conversionRate) || 1;
  const targetYear = parseInt(year);
  const targetMonth = parseInt(month);

  const results = [];
  const trackingIdsFound = new Set();

  const parser = fs.createReadStream(req.file.path).pipe(
    parse({
      skip_empty_lines: true,
      relax_column_count: true,
      relax_quotes: true,
      from_line: 2, // Adjust if your CSV has 1 or 2 header lines
    }),
  );

  for await (const row of parser) {
    // Skip header row or empty tracking IDs (Row[0] is Tracking ID in your new CSV)
    if (
      !row[0] ||
      row[0].trim() === "" ||
      row[0].toLowerCase().includes("tracking id")
    )
      continue;

    trackingIdsFound.add(row[0].trim());

    // Based on your sample:
    // row[0]: ID, row[1]: Clicks, row[2]: Ordered, row[4]: Shipped, row[5]: Returned, row[8]: Total Earnings
    const earningsOriginal = parseFloat(row[8]) || 0;

    results.push({
      apiAccount: apiAccountId,
      trackingId: row[0].trim(),
      year: targetYear,
      month: targetMonth,
      clicks: parseInt(row[1]) || 0,
      itemsOrdered: parseInt(row[2]) || 0,
      itemsShipped: parseInt(row[4]) || 0,
      itemsReturned: parseInt(row[5]) || 0,
      adFeesOriginal: earningsOriginal,
      adFeesUSD: earningsOriginal * rate,
      currency: currency || "USD",
      conversionRate: rate,
    });
  }

  try {
    // Clean up existing records for this specific month/year/account to prevent duplicates
    await SaleDetail.deleteMany({
      apiAccount: apiAccountId,
      year: targetYear,
      month: targetMonth,
    });

    // Map Tracking Tags to the results

    const tags = await TrackingTag.find({
      tag: { $in: Array.from(trackingIdsFound) },
    }).populate("user"); // This brings in the user's payoutPercentage

    const tagMap = new Map(
      tags.map((t) => [
        t.tag,
        {
          id: t._id,
          // If user exists, use their percentage; otherwise default to 100
          percentage: t.user ? t.user.payoutPercentage : 100,
        },
      ]),
    );

    const finalResults = results.map((item) => {
      const tagData = tagMap.get(item.trackingId);
      const appliedPercentage = tagData ? tagData.percentage : 100;

      return {
        ...item,
        trackingTag: tagData ? tagData.id : null,
        appliedPercentage: appliedPercentage,
        // Calculate the actual payout for the user
        userPayoutUSD: (item.adFeesUSD * appliedPercentage) / 100,
      };
    });

    await SaleDetail.insertMany(finalResults);

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.json({
      message: `Successfully saved ${finalResults.length} monthly records.`,
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "DB Save failed", details: err.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const {
      year,
      month,
      trackingId,
      apiAccountId,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};
    if (year) query.year = parseInt(year);
    if (month) query.month = parseInt(month);
    if (apiAccountId)
      query.apiAccount = new mongoose.Types.ObjectId(apiAccountId);

    if (trackingId && trackingId !== "all") {
      const idsArray = trackingId
        .split(/[,\s]+/)
        .filter((id) => id.trim() !== "");
      if (idsArray.length > 0) query.trackingId = { $in: idsArray };
    }

    const summary = await SaleDetail.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAdFees: { $sum: "$adFeesUSD" }, // Gross from Amazon
          totalPayable: { $sum: "$userPayoutUSD" }, // Share for users
        },
      },
    ]);

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { year: -1, month: -1 },
      populate: "trackingTag",
      lean: true,
    };

    const result = await SaleDetail.paginate(query, options);

    res.json({
      reports: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      summary: {
        totalAdFees: summary.length > 0 ? summary[0].totalAdFees : 0,
        totalPayable: summary.length > 0 ? summary[0].totalPayable : 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearEarnings = async (req, res) => {
  try {
    const { year, month, apiAccountId } = req.body;

    // 1. Strict Validation
    if (!apiAccountId || apiAccountId === "all") {
      return res.status(400).json({ error: "API Account is required." });
    }
    if (!year || year === "all") {
      return res.status(400).json({ error: "Year is required." });
    }

    // 2. Build the Query
    let query = {
      apiAccount: new mongoose.Types.ObjectId(apiAccountId),
      year: parseInt(year),
    };

    // 3. Optional Month Logic
    if (month && month !== "" && month !== "all") {
      query.month = parseInt(month);
    }

    // 4. Execute Deletion
    const result = await SaleDetail.deleteMany(query);

    // 5. Response
    const scope = query.month
      ? `Month ${query.month}/${query.year}`
      : `the entire year ${query.year}`;

    res.json({
      success: true,
      message: `Successfully cleared ${result.deletedCount} records for ${scope}.`,
      count: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Cleanup failed", details: err.message });
  }
};

export const getUserReports = async (req, res) => {
  try {
    let { year, month, userId, page = 1, limit = 10 } = req.query;

    let targetUserId = req.user._id;
    if (req.user.role === "admin" && userId) {
      targetUserId = new mongoose.Types.ObjectId(userId);
    }

    // Default to current year/month if not provided
    const qYear = year ? parseInt(year) : new Date().getFullYear();
    const qMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    const userTags = await TrackingTag.find({ user: targetUserId }).select(
      "_id",
    );
    const tagIds = userTags.map((t) => t._id);

    // pass username as well
    const user = await User.findById(targetUserId).select("name");
    const userName = user ? user.name : "";
    if (tagIds.length === 0)
      return res.json({ reports: [], totalDocs: 0, summary: 0, userName });

    const query = {
      trackingTag: { $in: tagIds },
      year: qYear,
      month: qMonth,
    };

    // Change the $group to sum both adFeesUSD and userPayoutUSD
    const summary = await SaleDetail.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAdFees: { $sum: "$adFeesUSD" }, // The 100% Gross Amount
          totalPayout: { $sum: "$userPayoutUSD" }, // The User's calculated share
        },
      },
    ]);

    const result = await SaleDetail.paginate(query, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { year: -1, month: -1 },
      populate: "trackingTag",
      lean: true,
    });

    res.json({
      reports: result.docs,
      userName,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      summary: {
        totalAdFees: summary.length > 0 ? summary[0].totalAdFees : 0,
        totalPayout: summary.length > 0 ? summary[0].totalPayout : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
