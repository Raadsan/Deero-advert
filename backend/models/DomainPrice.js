import mongoose from "mongoose";

const domainPriceSchema = new mongoose.Schema(
  {
    tld: {
      type: String,
      required: [true, "TLD is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const DomainPrice = mongoose.model("DomainPrice", domainPriceSchema);

export default DomainPrice;
