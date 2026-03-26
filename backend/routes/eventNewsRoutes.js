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

router.post("/", protect, createEventNews);
router.get("/", protect, getAllEventsNews);
router.get("/:id", protect, getEventNewsById);
router.patch("/:id", protect, updateEventNews);
router.delete("/:id", protect, deleteEventNews);

export default router;
