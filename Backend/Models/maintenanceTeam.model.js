import mongoose from "mongoose";

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
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // or Employee
      },
    ],
    // The link to categories this team handles?
    // "Workflow Logic: When a request is created for a specific team, only team members should pick it up."
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

MaintenanceTeamSchema.index({ companyId: 1, name: 1 }, { unique: true });

export default mongoose.model("MaintenanceTeam", MaintenanceTeamSchema);
