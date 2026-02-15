import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../modules/auth/auth.model.js";

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");

    const email = "admin@ims.com";
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    const hashed = await bcrypt.hash("admin123", 10);

    await User.create({
      email,
      password: hashed,
      role: "ADMIN",
    });

    console.log("✅ Admin created");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
