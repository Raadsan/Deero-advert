import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({

  // 🔁 OPTIONAL RELATIONS
  domainName: String, // Stored directly as string, not a reference
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  hostingPackage: { type: mongoose.Schema.Types.ObjectId, ref: "HostingPackage" },

  packageId: String, // ID of the selected package

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  type: {
    type: String,
    enum: ["register", "service_payment", "hosting_payment"],
    required: true
  },

  amount: { type: Number, required: true },

  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },

  paymentReferenceId: String,
  currency: { type: String, default: "USD" },
  description: String,

  paymentMethod: String, // "evc", "zaad", "card"

  completedAt: Date

}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
