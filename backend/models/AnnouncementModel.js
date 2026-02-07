// models/Announcement.js
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    // who receives this announcement
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    sendEmail: {
      type: Boolean,
      default: false,
    },

    sentAt: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin / manager
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Announcement", announcementSchema);
