import express from "express";
import {
    createAnnouncement,
    getActiveAnnouncements,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
    saveDeviceToken
} from "../controllers/AnnouncementController.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/active", getActiveAnnouncements);
router.post("/save-token", saveDeviceToken);

// Public: app & guests can list announcements (no JWT). Mutations stay protected.
router.get("/", getAnnouncements);
router.get("/:id", protect, authorizeMenuAccess("announcements", "announcement"), getAnnouncementById);
router.post("/", protect, authorizeMenuAccess("announcements", "announcement"), createAnnouncement);
router.patch("/:id", protect, authorizeMenuAccess("announcements", "announcement"), updateAnnouncement);
router.delete("/:id", protect, authorizeMenuAccess("announcements", "announcement"), deleteAnnouncement);

export default router;
