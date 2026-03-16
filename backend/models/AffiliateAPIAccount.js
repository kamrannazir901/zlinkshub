import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const affiliateAPIAccountSchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      required: true,
    },
    // The unique key to identify the specific app instance
    applicationId: {
      type: String,
      required: true,
      unique: true,
    },
    credentialId: {
      type: String,
      required: true,
    },
    credentialSecret: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    marketplace: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
affiliateAPIAccountSchema.plugin(mongoosePaginate);
export default mongoose.model("AffiliateAPIAccount", affiliateAPIAccountSchema);
