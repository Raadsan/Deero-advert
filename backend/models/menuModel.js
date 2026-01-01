import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    icon: {
      type: String,
      trim: true,
    },

    url: {
      type: String,
      trim: true,
    },

    isCollapsible: {
      type: Boolean,
      default: false,
    },

    subMenus: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
        title: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Menu", MenuSchema);
