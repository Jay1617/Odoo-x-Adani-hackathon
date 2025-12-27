import mongoose from "mongoose";

const MaintenanceCategorySchema = new mongoose.Schema(
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

    description: {
      type: String,
      trim: true,
    },

    // Number of maintenance employees assigned to this category
    assignedEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Maximum number of employees that can be assigned
    maxEmployees: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
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

MaintenanceCategorySchema.index({ companyId: 1, name: 1 }, { unique: true });
MaintenanceCategorySchema.index({ companyId: 1, isActive: 1 });

export default mongoose.model("MaintenanceCategory", MaintenanceCategorySchema);

