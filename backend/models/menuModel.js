// models/Menu.js
import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  title: String,
  path: String,

  permission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Permission",
  },
});

export default mongoose.model("Menu", menuSchema);
