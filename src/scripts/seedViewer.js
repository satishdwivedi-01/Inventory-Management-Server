// scripts/seedViewer.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../modules/auth/auth.model.js"; 

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ims_db";

const seedViewer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB ✅");

    const email = "viewer@example.com";
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("Viewer user already exists ✔️");
      process.exit(0);
    }

    const password = await bcrypt.hash("viewer123", 10);

    const viewer = await User.create({
      name: "Default Viewer",
      email,
      password,
      role: "VIEWER", // viewer role
    });

    console.log("Viewer user created successfully ✅");
    console.log("Email:", viewer.email);
    console.log("Password: viewer123");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding viewer:", err);
    process.exit(1);
  }
};

seedViewer();
