// models/Permission.js
import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: String,
  key: {
    type: String,
    unique: true,
    required: true,
  },
});

export default mongoose.model("Permission", permissionSchema);
