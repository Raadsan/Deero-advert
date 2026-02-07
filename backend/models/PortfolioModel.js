import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    gallery: [
      {
        type: String, // array of image paths
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", portfolioSchema);
