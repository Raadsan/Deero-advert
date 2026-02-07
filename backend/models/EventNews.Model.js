import mongoose from "mongoose";

const eventNewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["event", "news"],
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true }
);

export default mongoose.model("EventNews", eventNewsSchema);
