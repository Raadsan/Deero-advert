import mongoose from "mongoose";

const domainSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["registered","transferred","available"], default: "available" },
  registrationDate: Date,
  expiryDate: Date,
  price: { type: Number, default: 10 },
}, { timestamps: true });

export default mongoose.model("Domain", domainSchema);
