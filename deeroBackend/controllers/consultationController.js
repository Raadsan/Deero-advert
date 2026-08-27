import { prisma } from "../lib/prisma.js";

// @desc    Create a new consultation request
// @route   POST /api/consultations
// @access  Public
export const createConsultation = async (req, res) => {
  try {
    const { name, phone, email, location, service } = req.body;

    if (!name || !phone || !email || !location || !service) {
      return res.status(400).json({ success: false, error: "Please provide all required fields." });
    }

    const consultation = await prisma.consultation.create({
      data: { name, phone, email, location, service },
    });

    res.status(201).json({ success: true, data: consultation });
  } catch (error) {
    console.error("Error creating consultation:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get all consultation requests
// @route   GET /api/consultations
// @access  Private
export const getConsultations = async (req, res) => {
  try {
    const consultations = await prisma.consultation.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: consultations });
  } catch (error) {
    console.error("Error getting consultations:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Update consultation status
// @route   PATCH /api/consultations/:id
// @access  Private
export const updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: "Status is required." });
    }

    const consultation = await prisma.consultation.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    console.error("Error updating consultation status:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, error: "Consultation not found." });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Delete a consultation
// @route   DELETE /api/consultations/:id
// @access  Private
export const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.consultation.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ success: true, message: "Consultation deleted successfully." });
  } catch (error) {
    console.error("Error deleting consultation:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, error: "Consultation not found." });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
