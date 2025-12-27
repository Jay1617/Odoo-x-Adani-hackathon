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

    // assignedEmployees is now a virtual, we don't store it here
    
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

MaintenanceCategorySchema.virtual('assignedEmployees', {
    ref: 'User',
    localField: '_id',
    foreignField: 'maintenanceTeamId', // User model uses maintenanceTeamId
    justOne: false
});

MaintenanceCategorySchema.index({ companyId: 1, name: 1 }, { unique: true });
MaintenanceCategorySchema.index({ companyId: 1, isActive: 1 });

export default mongoose.model("MaintenanceCategory", MaintenanceCategorySchema);

