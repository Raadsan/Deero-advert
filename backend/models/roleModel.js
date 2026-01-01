import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["admin", "manager", "user"],
      required: true,
      unique: true,
    },

    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
