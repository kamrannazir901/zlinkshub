import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const saleDetailSchema = new mongoose.Schema(
  {
    apiAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AffiliateAPIAccount",
      required: true,
    },
    trackingTag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrackingTag",
      default: null,
    },
    trackingId: { type: String, required: true },

    // Monthly Identification
    year: { type: Number, required: true }, // e.g., 2026
    month: { type: Number, required: true }, // e.g., 3 for March

    // Performance Metrics
    clicks: { type: Number, default: 0 },
    itemsOrdered: { type: Number, default: 0 },
    itemsShipped: { type: Number, default: 0 },
    itemsReturned: { type: Number, default: 0 },

    // Earnings
    adFeesOriginal: { type: Number, default: 0 },
    adFeesUSD: { type: Number, default: 0 },
    userPayoutUSD: { type: Number, default: 0 },
    appliedPercentage: { type: Number, default: 100 },

    currency: { type: String, default: "USD" },
    conversionRate: { type: Number, default: 1 },
  },
  { timestamps: true },
);

// Compound index for fast filtering by year/month
saleDetailSchema.index({ apiAccount: 1, year: -1, month: -1 });

saleDetailSchema.index(
  { apiAccount: 1, year: 1, month: 1, trackingId: 1 },
  { unique: true },
);

saleDetailSchema.plugin(mongoosePaginate);
export default mongoose.model("SaleDetail", saleDetailSchema);
