import mongoose from "mongoose";

import User from "../models/User.js";
import bcrypt from "bcryptjs";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    seedAdmin();
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!adminExists) {
      await User.create({
        name: "System Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
      });

      console.log("✅ Default Admin user created successfully");
    }
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  }
};

export default connectDB;
