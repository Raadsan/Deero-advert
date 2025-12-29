// models/Role.js
import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["admin", "manager", "user"],
    required: true,
    unique: true,
  },

  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
});

export default mongoose.model("Role", roleSchema);
