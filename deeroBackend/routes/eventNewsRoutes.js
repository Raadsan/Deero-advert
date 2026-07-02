import express from "express";
import {
    createEventNews,
    getAllEventsNews,
    getEventNewsById,
    updateEventNews,
    deleteEventNews,
} from "../controllers/EventNewsController.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllEventsNews);
router.get("/:id", getEventNewsById);

router.post("/", protect, authorizeMenuAccess("events news", "event news", "news"), createEventNews);
router.patch("/:id", protect, authorizeMenuAccess("events news", "event news", "news"), updateEventNews);
router.delete("/:id", protect, authorizeMenuAccess("events news", "event news", "news"), deleteEventNews);

export default router;
