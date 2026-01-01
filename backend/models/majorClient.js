import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },
    images: [
      {
        type: String, // store filenames
        required: true
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
