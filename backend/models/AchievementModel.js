import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    count: {
      type: Number,
      required: true
    },

    icon: {
      type: String, // image filename
      required: true
    }
  },
  { timestamps: true }
);

const Achievement = mongoose.model("Achievement", achievementSchema);
export default Achievement;
