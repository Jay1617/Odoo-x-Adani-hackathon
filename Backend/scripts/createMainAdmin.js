import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../Models/user.model.js";
import connectDB from "../Db/index.db.js";

dotenv.config();

const createMainAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if main admin already exists
    const existingAdmin = await User.findOne({ role: "PLATFORM_ADMIN" });
    if (existingAdmin) {
      console.log("❌ Main admin already exists!");
      console.log(`   Email: ${existingAdmin.email_id}`);
      process.exit(0);
    }

    // Default main admin credentials
    const adminData = {
      name: "Platform Administrator",
      email_id: process.env.MAIN_ADMIN_EMAIL || "admin@gearguard.com",
      password: process.env.MAIN_ADMIN_PASSWORD || "Admin@123",
      role: "PLATFORM_ADMIN",
      isActive: true,
    };

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create main admin
    const mainAdmin = await User.create({
      ...adminData,
      password: hashedPassword,
    });

    console.log("✅ Main admin created successfully!");
    console.log(`   ID: ${mainAdmin._id}`);
    console.log(`   Name: ${mainAdmin.name}`);
    console.log(`   Email: ${mainAdmin.email_id}`);
    console.log(`   Password: ${adminData.password}`);
    console.log("\n⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating main admin:", error);
    process.exit(1);
  }
};

createMainAdmin();

