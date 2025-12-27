// models/Company.js
import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true, default: "India" },
  },
  { _id: false }
);

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: AddressSchema,
    },

    // The user who created the company (Company Admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional business metadata (billing, plan, etc.)
    plan: {
      type: String,
      enum: ["FREE", "PRO", "ENTERPRISE"],
      default: "FREE",
    },
    billingInfo: {
      stripeCustomerId: { type: String },
      // add other billing fields as needed (kept minimal)
    },

    // Soft-delete / active flag
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Arbitrary JSON for future settings
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Unique company name per platform (if you want unique per company owner, modify accordingly)
CompanySchema.index({ name: 1 }, { unique: true, background: true });

// Text index for searching companies quickly (optional)
CompanySchema.index({ name: "text", "address.city": "text" });

export default mongoose.model("Company", CompanySchema);
