import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const guideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true }, // This stores the ReactQuill HTML
    category: { type: String, required: true },
    readTime: { type: String, default: "5 min read" },
    author: { type: String, default: "ZLinksHub Editorial" },
  },
  { timestamps: true },
);
guideSchema.plugin(mongoosePaginate);

const Guide = mongoose.model("Guide", guideSchema);
export default Guide;
