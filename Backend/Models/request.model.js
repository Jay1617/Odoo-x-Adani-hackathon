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

    preferredDate: {
      type: Date, 
    },

    status: {
      type: String,
      enum: ["NEW", "APPROVED", "REJECTED", "ASSIGNED"],
      default: "NEW",
      index: true,
    },

    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceAssignment",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

MaintenanceRequestSchema.index({ companyId: 1, status: 1 });
MaintenanceRequestSchema.index({ requestedBy: 1, createdAt: -1 });

export default mongoose.model("MaintenanceRequest", MaintenanceRequestSchema);
