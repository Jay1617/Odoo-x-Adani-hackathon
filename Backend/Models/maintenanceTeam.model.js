import mongoose from "mongoose";
import User from "./user.model"

const MaintenanceTeamSchema = new mongoose.Schema(
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

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

MaintenanceTeamSchema.index({ companyId: 1, name: 1 }, { unique: true, background: true });

MaintenanceTeamSchema.virtual("memberCount").get(function () {
  return Array.isArray(this.members) ? this.members.length : 0;
});

export default mongoose.model("MaintenanceTeam", MaintenanceTeamSchema);
