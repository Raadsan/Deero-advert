import EventNews from "../models/EventNews.Model.js";

// ➕ CREATE
export const createEventNews = async (req, res) => {
  try {
    const { title, type, date } = req.body;

    if (!title || !type || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const item = await EventNews.create({
      title,
      type,
      date,
    });

    res.status(201).json({
      success: true,
      message: "Created successfully",
      data: item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 GET ALL (Latest first)
export const getAllEventsNews = async (req, res) => {
  try {
    const data = await EventNews.find({ isPublished: true })
      .sort({ date: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 GET BY ID
export const getEventNewsById = async (req, res) => {
  try {
    const item = await EventNews.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ UPDATE
export const updateEventNews = async (req, res) => {
  try {
    const updated = await EventNews.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🗑 DELETE
export const deleteEventNews = async (req, res) => {
  try {
    await EventNews.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
