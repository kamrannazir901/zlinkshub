import mongoose from "mongoose";

const trackingTagSchema = new mongoose.Schema(
  {
    tag: { type: String, required: true, unique: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    apiAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AffiliateAPIAccount",
      required: true,
    },
    marketplace: { type: String },
  },
  { timestamps: true },
);

// Fixed the reference name here to match the variable above
trackingTagSchema.index({ user: 1, marketplace: 1 });

export default mongoose.model("TrackingTag", trackingTagSchema);
