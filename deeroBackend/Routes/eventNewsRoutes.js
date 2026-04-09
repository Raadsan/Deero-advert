import express from "express";
import {
    createEventNews,
    getAllEventsNews,
    getEventNewsById,
    updateEventNews,
    deleteEventNews,
} from "../controllers/EventNewsController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllEventsNews);
router.get("/:id", getEventNewsById);

router.post("/", protect, createEventNews);
router.patch("/:id", protect, updateEventNews);
router.delete("/:id", protect, deleteEventNews);

export default router;
