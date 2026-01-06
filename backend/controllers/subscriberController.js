// controllers/subscriberController.js
import Subscriber from "../models/Subscriber Model.js";

/**
 * ➕ SUBSCRIBE
 * POST /api/subscribers
 */
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const exists = await Subscriber.findOne({ email });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email already subscribed",
      });
    }

    const subscriber = await Subscriber.create({ email });

    res.status(201).json({
      success: true,
      message: "Subscribed successfully 🎉",
      subscriber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * 📄 GET ALL SUBSCRIBERS
 * GET /api/subscribers
 */
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: subscribers.length,
      subscribers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * 📄 GET SUBSCRIBER BY ID
 * GET /api/subscribers/:id
 */
export const getSubscriberById = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Subscriber.findById(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
    }

    res.status(200).json({
      success: true,
      subscriber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid ID or server error",
    });
  }
};

/**
 * ✏️ UPDATE SUBSCRIBER
 * PATCH /api/subscribers/:id
 */
export const updateSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, isActive } = req.body;

    const subscriber = await Subscriber.findByIdAndUpdate(
      id,
      { email, isActive },
      { new: true, runValidators: true }
    );

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscriber updated",
      subscriber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * 🗑 DELETE / UNSUBSCRIBE
 * DELETE /api/subscribers/:id
 */
export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Subscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscriber deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
