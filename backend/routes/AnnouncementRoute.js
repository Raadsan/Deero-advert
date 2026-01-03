// routes/announcementRoutes.js
import express from "express";
import {
    createAnnouncementForUsers,
    getAnnouncements,
    getAnnouncementById,
    deleteAnnouncement,
} from "../controllers/AnnouncementController.js";
import { protect } from "../middlewares/authMiddleware.js";


const router = express.Router();

// Apply protection to all announcement routes
router.use(protect);

// Send announcement to all users (and create)
router.post("/", createAnnouncementForUsers);

// Get all announcements
router.get("/", getAnnouncements);

// Get single announcement
router.get("/:id", getAnnouncementById);

// Delete announcement
router.delete("/:id", deleteAnnouncement);

export default router;
