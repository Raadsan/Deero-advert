import { prisma } from "../lib/prisma.js";

// SUBSCRIBE
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const subscriber = await prisma.subscriber.create({
      data: { email },
    });

    res.status(201).json({ success: true, message: "Subscribed successfully 🎉", subscriber });
  } catch (error) {
    if (error.code === 'P2002') return res.status(409).json({ success: false, message: "Email already subscribed" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET ALL SUBSCRIBERS
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, total: subscribers.length, subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET SUBSCRIBER BY ID
export const getSubscriberById = async (req, res) => {
  try {
    const subscriber = await prisma.subscriber.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!subscriber) return res.status(404).json({ success: false, message: "Subscriber not found" });
    res.status(200).json({ success: true, subscriber });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// UPDATE SUBSCRIBER
export const updateSubscriber = async (req, res) => {
  try {
    const { email, isActive } = req.body;
    const subscriber = await prisma.subscriber.update({
      where: { id: parseInt(req.params.id) },
      data: { email, isActive: isActive !== undefined ? Boolean(isActive) : undefined },
    });

    res.status(200).json({ success: true, message: "Subscriber updated", subscriber });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// DELETE / UNSUBSCRIBE
export const deleteSubscriber = async (req, res) => {
  try {
    await prisma.subscriber.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ success: true, message: "Subscriber deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
