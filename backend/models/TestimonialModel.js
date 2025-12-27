import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true
    },

    clientTitle: {
      type: String,
      required: true,
      trim: true
    },

    clientImage: {
      type: String, // image filename
      required: true
    },

    message: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
