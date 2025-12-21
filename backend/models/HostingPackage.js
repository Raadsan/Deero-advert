import mongoose from "mongoose";

const HostingPackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String },
  price: { type: Number, required: true },
  pudgeText: { type: String },
  features: { type: [String] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("HostingPackage", HostingPackageSchema);

