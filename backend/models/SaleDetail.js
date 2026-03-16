import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const saleDetailSchema = new mongoose.Schema(
  {
    // Link to the specific API Account used for this report
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
    asin: { type: String, required: true },
    dateShipped: { type: Date, required: true },
    reportStartDate: { type: Date, required: true },
    reportEndDate: { type: Date, required: true },
    adFees: { type: Number, default: 0 },
    adFeesOriginal: { type: Number, default: 0 },
    isReturn: { type: Boolean, default: false },
    revenue: { type: Number, default: 0 },
    revenueOriginal: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    conversionRate: { type: Number, default: 1 },
    itemsShipped: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Optimized compound index
saleDetailSchema.index({
  apiAccount: 1,
  trackingId: 1,
  dateShipped: -1,
});

saleDetailSchema.plugin(mongoosePaginate);
export default mongoose.model("SaleDetail", saleDetailSchema);
