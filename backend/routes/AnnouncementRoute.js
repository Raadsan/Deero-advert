// routes/announcementRoutes.js
import express from "express";
import {
    createAnnouncement,
    getActiveAnnouncements,
    getAnnouncements,
    updateAnnouncement,
    getAnnouncementById,
    deleteAnnouncement,
    saveDeviceToken,
} from "../controllers/AnnouncementController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Public: Flutter app waxay token u diraysaa (login iyo la'aanba)
router.post("/save-token", saveDeviceToken);

// Public route for active announcements
router.get("/active", getActiveAnnouncements);

// Protected routes
router.use(protect);

// Create announcement
router.post("/", createAnnouncement);

// Update announcement
router.patch("/:id", updateAnnouncement);

// Get all announcements (for management)
router.get("/", getAnnouncements);

// Get single announcement
router.get("/:id", getAnnouncementById);

// Delete announcement
router.delete("/:id", deleteAnnouncement);

export default router;
