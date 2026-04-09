import { prisma } from "../lib/prisma.js";

/**
 * Create Announcement
 */
export const createAnnouncement = async (req, res) => {
    try {
        const { title, message, startDate, endDate } = req.body;

        if (!title || !message || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Title, message, startDate, and endDate are required",
            });
        }

        const announcement = await prisma.announcement.create({
            data: {
                title,
                message,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                createdById: req.user.id,
            },
        });

        // FCM push notifications skipped as per request to focus on controllers
        
        return res.status(201).json({
            success: true,
            message: "Announcement created successfully",
            data: announcement,
        });
    } catch (error) {
        console.error("Error creating announcement:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get active announcements for visitors
 */
export const getActiveAnnouncements = async (req, res) => {
    try {
        const now = new Date();
        const announcements = await prisma.announcement.findMany({
            where: {
                startDate: { lte: now },
                endDate: { gte: now },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        console.error("Error fetching active announcements:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get all announcements
 */
export const getAnnouncements = async (req, res) => {
    try {
        const announcements = await prisma.announcement.findMany({
            include: { createdBy: { select: { fullname: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get single announcement by ID
 */
export const getAnnouncementById = async (req, res) => {
    try {
        const announcement = await prisma.announcement.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { createdBy: { select: { fullname: true, email: true } } },
        });

        if (!announcement) {
            return res.status(404).json({ success: false, message: "Announcement not found" });
        }

        res.status(200).json({ success: true, data: announcement });
    } catch (error) {
        console.error("Error fetching announcement:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update announcement by ID
 */
export const updateAnnouncement = async (req, res) => {
    try {
        const { title, message, startDate, endDate } = req.body;
        const id = parseInt(req.params.id);

        const data = {};
        if (title) data.title = title;
        if (message) data.message = message;
        if (startDate) data.startDate = new Date(startDate);
        if (endDate) data.endDate = new Date(endDate);

        const announcement = await prisma.announcement.update({
            where: { id },
            data,
        });

        res.status(200).json({
            success: true,
            message: "Announcement updated successfully",
            data: announcement,
        });
    } catch (error) {
        console.error("Error updating announcement:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete announcement by ID
 */
export const deleteAnnouncement = async (req, res) => {
    try {
        await prisma.announcement.delete({
            where: { id: parseInt(req.params.id) },
        });

        res.status(200).json({ success: true, message: "Announcement deleted successfully" });
    } catch (error) {
        console.error("Error deleting announcement:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Save Device Token
 */
export const saveDeviceToken = async (req, res) => {
    try {
        const { token, userId } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        const deviceToken = await prisma.deviceToken.upsert({
            where: { token },
            update: { userId: userId ? parseInt(userId) : null },
            create: { token, userId: userId ? parseInt(userId) : null },
        });

        return res.status(200).json({ success: true, message: "Token saved successfully", data: deviceToken });
    } catch (error) {
        console.error("Error saving device token:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
