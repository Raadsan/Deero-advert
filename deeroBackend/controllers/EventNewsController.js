import { prisma } from "../lib/prisma.js";

// ➕ CREATE
export const createEventNews = async (req, res) => {
  try {
    const { title, type, date, description } = req.body;

    if (!title || !type || !date || !description) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const item = await prisma.eventNews.create({
      data: {
        title,
        type,
        date: new Date(date),
        description,
      },
    });

    res.status(201).json({ success: true, message: "Created successfully", data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 GET ALL (Latest first)
export const getAllEventsNews = async (req, res) => {
  try {
    const data = await prisma.eventNews.findMany({
      where: { isPublished: true },
      orderBy: { date: 'desc' },
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 GET BY ID
export const getEventNewsById = async (req, res) => {
  try {
    const item = await prisma.eventNews.findUnique({ where: { id: parseInt(req.params.id) } });

    if (!item) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ UPDATE
export const updateEventNews = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.date) data.date = new Date(data.date);

    const updated = await prisma.eventNews.update({
      where: { id: parseInt(req.params.id) },
      data,
    });

    res.json({ success: true, message: "Updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🗑 DELETE
export const deleteEventNews = async (req, res) => {
  try {
    await prisma.eventNews.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
