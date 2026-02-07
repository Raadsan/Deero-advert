import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
        },
        type: {
            type: String,
            required: [true, "Job type is required"],
            enum: ["Full-time", "Part-time","Internship"],
            default: "Full-time",
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Job description is required"],
            trim: true,
        },
        postedDate: {
            type: Date,
            required: [true, "Posted date is required"],
        },
        expireDate: {
            type: Date,
            required: [true, "Expire date is required"],
        },
    },
    {
        timestamps: true,
    }
);

// Virtual field to check if job is active
careerSchema.virtual("isActive").get(function () {
    return new Date() <= this.expireDate;
});

// Ensure virtuals are included in JSON
careerSchema.set("toJSON", { virtuals: true });
careerSchema.set("toObject", { virtuals: true });

const Career = mongoose.model("Career", careerSchema);

export default Career;
