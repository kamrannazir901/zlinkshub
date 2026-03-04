import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/auth.js";
import affiliateAPIRoutes from "./routes/affiliateAPI.js";
import trackingTagRoutes from "./routes/trackingTag.js";
import userRoutes from "./routes/userRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import guideRoutes from "./routes/guideRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// // Routes
app.use("/api/auth", authRoutes);
app.use("/api/affiliate-accounts", affiliateAPIRoutes);
app.use("/api/tracking-tags", trackingTagRoutes);
app.use("/api/users", userRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/guides", guideRoutes);

// Test Route
app.get("/", (req, res) => res.send("Affilvio Backend is Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
