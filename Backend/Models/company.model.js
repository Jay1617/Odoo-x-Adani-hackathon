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

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: String,
      enum: ["FREE", "PRO", "ENTERPRISE"],
      default: "FREE",
    },
    billingInfo: {
      stripeCustomerId: { type: String },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, 
  }
);

CompanySchema.index({ name: 1 }, { unique: true, background: true });
CompanySchema.index({ name: "text", "address.city": "text" });

export default mongoose.model("Company", CompanySchema);
