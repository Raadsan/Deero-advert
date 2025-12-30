import mongoose from "mongoose";

const domainSearchSchema = new mongoose.Schema(
  {
    domain: String,
    available: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("DomainSearch", domainSearchSchema);
