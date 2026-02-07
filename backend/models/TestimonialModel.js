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
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5
    }
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
