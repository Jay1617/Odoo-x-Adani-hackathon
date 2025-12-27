import mongoose from "mongoose";

const MaintenanceRequestSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
      index: true,
    },

    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },

    maintenanceTeamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MaintenanceTeam",
    },

    requestType: {
      type: String,
      enum: ["CORRECTIVE", "PREVENTIVE"],
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    scheduledDate: {
      type: Date, // For preventive maintenance
    },

    status: {
      type: String,
      enum: ["NEW", "IN_PROGRESS", "REPAIRED", "SCRAP"],
      default: "NEW",
      index: true,
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    duration: {
        type: Number, // Hours spent
        default: 0
    },
    
    // Notes or resolution details
    resolution: {
        type: String,
        trim: true
    }
  },
  {
    timestamps: true,
  }
);

MaintenanceRequestSchema.index({ companyId: 1, status: 1 });
MaintenanceRequestSchema.index({ requestedBy: 1, createdAt: -1 });

export default mongoose.model("MaintenanceRequest", MaintenanceRequestSchema);
