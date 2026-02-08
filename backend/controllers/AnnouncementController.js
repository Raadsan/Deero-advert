// controllers/announcementController.js
import Announcement from "../models/AnnouncementModel.js";
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
export const createAnnouncementForUsers = async (req, res) => {
    try {
        const { title, message, sendEmail: sendMail } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: "Title and message are required",
            });
        }

        let recipientIds = [];
        let cleanFoundUsers = [];

        // 1. If recipients are provided in body, use them
        if (req.body.recipients && Array.isArray(req.body.recipients) && req.body.recipients.length > 0) {
            recipientIds = req.body.recipients;

            // Verify users exist
            const users = await User.find({ _id: { $in: recipientIds } }).select("email fullname");
            if (users.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "None of the provided recipient IDs were found",
                });
            }
            cleanFoundUsers = users;
        } else {
            // 2. Broadcast to all users with role 'user'
            const userRole = await Role.findOne({ name: "user" });

            if (!userRole) {
                return res.status(404).json({
                    success: false,
                    message: "Role 'user' not found in system. Cannot broadcast.",
                });
            }

            const users = await User.find({ role: userRole._id }).select("_id email fullname");

            if (!users.length) {
                return res.status(400).json({
                    success: false,
                    message: "No users with role 'user' found to broadcast to.",
                });
            }

            recipientIds = users.map((u) => u._id);
            cleanFoundUsers = users;
        }

        // Save announcement in DB
        const announcement = await Announcement.create({
            title,
            message,
            recipients: recipientIds,
            sendEmail: sendMail || false,
            sentAt: sendMail ? new Date() : null,
            createdBy: req.user._id,
        });

        // Send response immediately
        res.status(201).json({
            success: true,
            message: sendMail
                ? "Announcement created. Emails are being sent in the background."
                : "Announcement created successfully",
            data: announcement,
            emailSent: true, // Optimistic success for UI
        });

        // Process emails in background if requested
        if (sendMail && cleanFoundUsers.length > 0) {
            // Use setImmediate or just don't await the promise effectively checks out of the request lifecycle
            // In serverless environments, this might be killed, but for a standard persistent server (like typical Node apps), this works.
            (async () => {
                try {
                    console.log(`[Background] Starting to send ${cleanFoundUsers.length} emails for announcement: ${announcement._id}`);
                    for (const user of cleanFoundUsers) {
                        try {
                            await sendEmail({
                                email: user.email,
                                subject: title,
                                message,
                                html: `
                                    <h2>Hello ${user.fullname},</h2>
                                    <p>${message}</p>
                                `,
                            });
                        } catch (innerErr) {
                            console.error(`[Background] Failed to send email to ${user.email}:`, innerErr.message);
                            // Verify if we should update DB status here or just log
                        }
                    }
                    console.log(`[Background] Finished sending emails for announcement: ${announcement._id}`);
                } catch (emailErr) {
                    console.error("[Background] Error in email sending loop:", emailErr);
                }
            })();
        }

    } catch (error) {
        console.error("Error creating announcement:", error);
        // If headers weren't sent yet
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};

/**
 * Get all announcements
 * GET /api/announcements
 */
export const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .populate("recipients", "fullname email")
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
            .populate("recipients", "fullname email")
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
