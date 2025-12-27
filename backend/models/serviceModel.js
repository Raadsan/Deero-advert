import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  serviceTitle: {
    type: String,
    required: true
  },
  serviceIcon: {
    type: String,
    required: true  
  },

  packages: [
    {
      packageTitle: {
        type: String,
        required: true
      },

      price: {
        type: Number,
        required: true
      },

      features: [
        {
          type: String,
          required: true
        }
      ]
    }
  ]
}, { timestamps: true });

const ServiceModel = mongoose.model("Service", serviceSchema);
export default ServiceModel;
