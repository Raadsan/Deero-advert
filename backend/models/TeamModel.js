import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String, // uploads/filename.ext
      required: true,
    },

    socials: [
      {
        platform: {
          type: String, // facebook, twitter, linkedin, github etc
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
