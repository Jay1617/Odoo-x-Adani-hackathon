import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email_id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "PLATFORM_ADMIN",
        "COMPANY_ADMIN",
        "MAINTENANCE_TEAM",
        "EMPLOYEE",
      ],
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null, 
    },

    maintenanceTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceTeam",
      default: null,
    },

    phone: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    lastLogout: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema, process.env.COLLECTION_NAME || "auth");
