import { prisma } from "../lib/prisma.js";

// Add Testimonial
export const addTestimonial = async (req, res) => {
  try {
    const { clientName, clientTitle, message, rating } = req.body;

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName,
        clientTitle,
        message,
        rating: rating ? parseInt(rating) : 5,
        clientImage: req.file ? req.file.path.replace(/\\/g, "/") : ""
      },
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Failed to add testimonial", error: error.message });
  }
};

// Get All Testimonials
export const getTestimonials = async (req, res) => {
  try {
    const data = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch testimonials", error: error.message });
  }
};

// Update Testimonial
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientName, clientTitle, message, rating } = req.body;

    const data = {};
    if (clientName !== undefined) data.clientName = clientName;
    if (clientTitle !== undefined) data.clientTitle = clientTitle;
    if (message !== undefined) data.message = message;
    if (rating !== undefined) data.rating = parseInt(rating);
    if (req.file) data.clientImage = req.file.path.replace(/\\/g, "/");

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, message: "No updatable fields provided" });
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: data,
    });

    res.status(200).json({ success: true, message: "Testimonial updated successfully", data: updatedTestimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    await prisma.testimonial.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
