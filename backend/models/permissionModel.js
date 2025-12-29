import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Magaca permission, tusaale: "Read User"
  },
  key: {
    type: String,
    unique: true,
    required: true, // Key gaar ah, tusaale: "user.read"
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true, // Permission-ka waa inuu ku xirnaadaa Role
  },
}, { timestamps: true });

export default mongoose.model("Permission", permissionSchema);
