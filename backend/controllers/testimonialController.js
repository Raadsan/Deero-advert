import Testimonial from "../models/TestimonialModel.js";

// =======================
// Add Testimonial
// =======================
export const addTestimonial = async (req, res) => {
  try {
    const { clientName, clientTitle, message, rating } = req.body;

    const testimonial = new Testimonial({
      clientName,
      clientTitle,
      message,
      rating: rating || 5,
      clientImage: req.file ? req.file.filename : ""
    });

    const saved = await testimonial.save();
    res.status(201).json(saved);

  } catch (error) {
    res.status(500).json({
      message: "Failed to add testimonial",
      error: error.message
    });
  }
};

// =======================
// Get All Testimonials
// =======================
export const getTestimonials = async (req, res) => {
  try {
    const data = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
};

// =======================
// Update Testimonial
// =======================
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientName, clientTitle, message, rating } = req.body;

    // Build update object (only include fields that are provided)
    const update = {};

    if (clientName !== undefined) {
      update.clientName = clientName;
    }

    if (clientTitle !== undefined) {
      update.clientTitle = clientTitle;
    }

    if (message !== undefined) {
      update.message = message;
    }

    if (rating !== undefined) {
      update.rating = rating;
    }

    // Handle client image file upload if provided (optional for update)
    if (req.file) {
      update.clientImage = req.file.filename;
    }

    // If no fields provided to update, return 400
    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No updatable fields provided"
      });
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: updatedTestimonial
    });

  } catch (error) {
    console.error("Update Testimonial Error:", error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({
        message: "Validation error",
        success: false,
        error: errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// =======================
// Delete Testimonial
// =======================
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
