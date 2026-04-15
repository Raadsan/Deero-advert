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
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/active", getActiveAnnouncements);
router.post("/save-token", saveDeviceToken);

// Public: app & guests can list announcements (no JWT). Mutations stay protected.
router.get("/", getAnnouncements);
router.get("/:id", protect, getAnnouncementById);
router.post("/", protect, createAnnouncement);
router.patch("/:id", protect, updateAnnouncement);
router.delete("/:id", protect, deleteAnnouncement);

export default router;
