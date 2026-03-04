import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amazonUrl: {
    type: String,
    required: true,
  },
  affiliateUrl: {
    type: String,
    required: true,
  },
  marketplace: {
    type: String,
    required: true,
  },
  productData: {
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String },
    asin: { type: String },
    description: { type: String },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Link", LinkSchema);
