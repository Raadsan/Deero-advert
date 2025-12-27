import Testimonial from "../models/TestimonialModel.js";

// =======================
// Add Testimonial
// =======================
export const addTestimonial = async (req, res) => {
  try {
    const { clientName, clientTitle, message } = req.body;

    const testimonial = new Testimonial({
      clientName,
      clientTitle,
      message,
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
