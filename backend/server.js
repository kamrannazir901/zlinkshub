import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
// Import routes
import authRoutes from "./routes/auth.js";
import affiliateAPIRoutes from "./routes/affiliateAPI.js";
import trackingTagRoutes from "./routes/trackingTag.js";
import userRoutes from "./routes/userRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import guideRoutes from "./routes/guideRoutes.js";
import Link from "./models/Link.js";
dotenv.config();
connectDB();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ─────────────────────────────────────────────
// VITE DIST SETUP
// ─────────────────────────────────────────────
const distPath = path.resolve(__dirname, "../frontend/dist"); // 👈 adjust if needed
const indexHTML = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");

// Middleware
app.use(cors());
app.use(express.json());

// Serve Vite static assets (JS, CSS, images)
app.use(express.static(distPath, { index: false }));
// // Routes
app.use("/api/auth", authRoutes);
app.use("/api/affiliate-accounts", affiliateAPIRoutes);
app.use("/api/tracking-tags", trackingTagRoutes);
app.use("/api/users", userRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/guides", guideRoutes);

// Test Route
app.get("/", (req, res) => res.send("Affilvio Backend is Running"));

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

// ─────────────────────────────────────────────
// OG TAG INJECTION — Product pages
// ─────────────────────────────────────────────
app.get("/product/:id", async (req, res) => {
  try {
    const link = await Link.findById(req.params.id).lean();

    if (!link) {
      return res.send(indexHTML); // React app handles the 404
    }

    const { productData } = link;
    const pageUrl = `https://zlinkshub.com/product/${req.params.id}`;

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
    res.send(indexHTML); // fallback to React app
  }
});

// ─────────────────────────────────────────────
// CATCH-ALL — All other routes serve React app
// ─────────────────────────────────────────────
app.get("*", (req, res) => {
  res.send(indexHTML);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
