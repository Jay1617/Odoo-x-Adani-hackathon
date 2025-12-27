import mongoose from "mongoose";

const EquipmentSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    serialNumber: {
      type: String,
      required: true,
      trim: true,
    },

    purchaseDate: {
      type: Date,
      required: true,
    },

    warrantyExpiry: {
      type: Date,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    // Employee who owns/uses this equipment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Maintenance category this equipment belongs to
    maintenanceCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceCategory",
    },

    // Default maintenance team for this equipment
    maintenanceTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceTeam",
    },

    // Default maintenance category for this equipment
    defaultMaintenanceCategory: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SCRAPPED"],
      default: "ACTIVE",
    },

    notes: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

EquipmentSchema.index({ companyId: 1, serialNumber: 1 }, { unique: true });
EquipmentSchema.index({ companyId: 1, status: 1 });
EquipmentSchema.index({ assignedTo: 1 });

export default mongoose.model("Equipment", EquipmentSchema);

