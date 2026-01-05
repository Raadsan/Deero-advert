import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  domain: { type: mongoose.Schema.Types.ObjectId, ref: "Domain", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { 
    type: String, 
    enum: ["register","transfer","renew","payment"], 
    required: true 
  },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending","completed","failed"], 
    default: "pending" 
  },
  paymentReferenceId: { type: String }, // ID from payment gateway
  currency: { type: String, default: "USD" },
  description: { type: String },
  // Optional: store payment method info
  paymentMethod: { type: String }, // e.g., "mwallet_account", "card"
  completedAt: { type: Date }      // timestamp when payment completed
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
