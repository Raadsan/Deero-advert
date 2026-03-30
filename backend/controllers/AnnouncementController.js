// controllers/announcementController.js
import Announcement from "../models/AnnouncementModel.js";
import admin, { firebaseInitialized } from '../firebase.js';
import DeviceToken from '../models/DeviceTokenModel.js';
import User from "../models/UserModel.js";
import Role from "../models/roleModel.js";
import sendEmail from "../utils/sendEmail.js";

/**
 * Create Announcement and send to all users (role = 'user')
 * POST /api/announcements/users
 * Body:
 * {
 *   "title": "Big Discount 🎉",
 *   "message": "We have 30% discount on all services!",
 *   "sendEmail": true
 * }
 */
/**
 * Create Announcement for all visitors
 * POST /api/announcements
 * Body: { "title": "...", "message": "...", "startDate": "...", "endDate": "..." }
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

        // Save announcement in DB
        const announcement = await Announcement.create({
            title,
            message,
            startDate,
            endDate,
            createdBy: req.user._id,
        });

        // ✅ Dir FCM Push Notification isla markiiba dhamaan devices-ka
        if (!firebaseInitialized) {
            console.log('⚠️ Firebase not initialized — skipping FCM push notification');
        } else {
        try {
            const allTokens = await DeviceToken.find().select('token');
            const tokenList = allTokens.map(t => t.token).filter(Boolean);
            
            // Console-ka kusoo daabac tokens-ka diiwaangashan
            console.log("📱 \n=== REGISTERED DEVICES ===");
            console.log(tokenList);
            console.log("==========================\n");

            if (tokenList.length > 0) {
                const fcmResponse = await admin.messaging().sendEachForMulticast({
                    tokens: tokenList,
                    notification: {
                        title: title,
                        body: message,
                    },
                    android: { 
                        priority: 'high',
                        notification: {
                            sound: 'default',
                        }
                    },
                    apns: {
                        payload: {
                            aps: {
                                sound: 'default',
                                badge: 1,
                            }
                        }
                    },
                    data: {
                        click_action: 'FLUTTER_NOTIFICATION_CLICK',
                        type: 'announcement',
                        announcementId: announcement._id.toString(),
                    },
                });
                console.log(`✅ FCM push => success: ${fcmResponse.successCount} | failed: ${fcmResponse.failureCount}`);
            } else {
                console.log('⚠️ FCM push: registered devices kuma jiraan wali');
            }
        } catch (fcmError) {
            // FCM error announcement-ka ha joojiyo
            console.error('⚠️ FCM push error (announcement DB ayaa la kaydiyay):', fcmError.message);
        }
        } // End of firebaseInitialized check

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
 * GET /api/announcements/active
 */
export const getActiveAnnouncements = async (req, res) => {
    try {
        const now = new Date();
        const announcements = await Announcement.find({
            startDate: { $lte: now },
            endDate: { $gte: now },
        }).sort({ createdAt: -1 });

        // Kaliya data soo celi - push notification createAnnouncement ayuu ka yimaadaa
        res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        console.error("Error fetching active announcements:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};



/**
 * Get all announcements
 * GET /api/announcements
 */
export const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .populate("createdBy", "fullname email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get single announcement by ID
 * GET /api/announcements/:id
 */
export const getAnnouncementById = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id)
            .populate("createdBy", "fullname email");

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
 * PATCH /api/announcements/:id
 */
export const updateAnnouncement = async (req, res) => {
    try {
        const { title, message, startDate, endDate } = req.body;
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ success: false, message: "Announcement not found" });
        }

        if (title) announcement.title = title;
        if (message) announcement.message = message;
        if (startDate) announcement.startDate = startDate;
        if (endDate) announcement.endDate = endDate;

        await announcement.save();

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
 * DELETE /api/announcements/:id
 */
export const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);

        if (!announcement) {
            return res.status(404).json({ success: false, message: "Announcement not found" });
        }

        res.status(200).json({ success: true, message: "Announcement deleted successfully" });
    } catch (error) {
        console.error("Error deleting announcement:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Save FCM Device Token - Flutter app waxay u diraysaa marka bilowdo
 * POST /api/announcements/save-token
 * Body: { "token": "FCM_TOKEN", "userId": "..." (optional) }
 * Public route - login ma loo baahna
 */
export const saveDeviceToken = async (req, res) => {
    try {
        const { token, userId } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        // upsert: haddii token horeba jiro wax ka beddel, haddii kale ku dar
        await DeviceToken.findOneAndUpdate(
            { token },
            { token, userId: userId || null },
            { upsert: true, new: true }
        );

        console.log(`✅ FCM token la kaydiyay | userId: ${userId || 'guest'}`);
        return res.status(200).json({ success: true, message: "Token saved successfully" });
    } catch (error) {
        console.error("Error saving device token:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
