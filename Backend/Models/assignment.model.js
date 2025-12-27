import mongoose from "mongoose";

const MaintenanceAssignmentSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceRequest",
      required: true,
      unique: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    // Maintenance employee assigned to this task
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Maintenance category
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceCategory",
    },

    // Status of the assignment
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },

    // When the work started
    startedAt: {
      type: Date,
    },

    // When the work was completed
    completedAt: {
      type: Date,
    },

    // Duration in hours
    duration: {
      type: Number,
      default: 0,
    },

    // Notes from the maintenance employee
    notes: {
      type: String,
      trim: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

MaintenanceAssignmentSchema.index({ companyId: 1, status: 1 });
MaintenanceAssignmentSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.model("MaintenanceAssignment", MaintenanceAssignmentSchema);

