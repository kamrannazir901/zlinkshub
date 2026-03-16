import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import authRoutes from "./routes/auth.js";
import affiliateAPIRoutes from "./routes/affiliateAPI.js";
import trackingTagRoutes from "./routes/trackingTag.js";
import userRoutes from "./routes/userRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import guideRoutes from "./routes/guideRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import Link from "./models/Link.js";

dotenv.config();
connectDB();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ─────────────────────────────────────────────
// VITE DIST SETUP
// ─────────────────────────────────────────────
const distPath = path.resolve(__dirname, "../frontend/dist"); // 👈 your path
const indexHTML = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");

// ─────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ✅ 1. Static assets FIRST (JS, CSS, images from dist)
app.use(express.static(distPath, { index: false }));

// ✅ 2. API routes SECOND — these start with /api so no conflict
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/affiliate-accounts", affiliateAPIRoutes);
app.use("/api/tracking-tags", trackingTagRoutes);
app.use("/api/users", userRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/guides", guideRoutes);

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────
function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ✅ 3. OG injection for product pages
app.get("/product/:id", async (req, res) => {
  try {
    const link = await Link.findById(req.params.id).lean();

    if (!link) {
      return res.send(indexHTML);
    }

    const { productData } = link;
    const pageUrl =
      process.env.NODE_ENV === "production"
        ? `https://zlinkshub.com/product/${req.params.id}`
        : `http://localhost:5000/product/${req.params.id}`;

    const ogTags = `
    <title>${escapeHTML(productData?.title)} | ZLinksHub</title>
    <meta name="description" content="${escapeHTML(productData?.description?.slice(0, 160))}" />
    <meta property="og:type" content="product" />
    <meta property="og:title" content="${escapeHTML(productData?.title)}" />
    <meta property="og:description" content="${escapeHTML(productData?.description?.slice(0, 160))}" />
    <meta property="og:image" content="${escapeHTML(productData?.image)}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:site_name" content="ZLinksHub" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHTML(productData?.title)}" />
    <meta name="twitter:description" content="${escapeHTML(productData?.description?.slice(0, 160))}" />
    <meta name="twitter:image" content="${escapeHTML(productData?.image)}" />
    `;

    const html = indexHTML.replace("</head>", `${ogTags}</head>`);
    res.send(html);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(400).send("Invalid product ID");
    }
    console.error(err);
    res.send(indexHTML);
  }
});

// ✅ 4. Catch-all LAST — serves React for all other frontend routes
// ✅ Replace with this
app.get("/{*path}", (req, res) => {
  res.send(indexHTML);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
