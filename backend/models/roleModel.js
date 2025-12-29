import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["admin", "manager", "user"], 
    required: true,
    unique: true,
  },
}, { timestamps: true });

export default mongoose.model("Role", roleSchema);
