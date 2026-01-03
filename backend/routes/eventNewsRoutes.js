import express from "express";
import {
  createEventNews,
  getAllEventsNews,
  getEventNewsById,
  updateEventNews,
  deleteEventNews,
} from "../controllers/EventNewsController.js";

const router = express.Router();

router.post("/", createEventNews);
router.get("/", getAllEventsNews);
router.get("/:id", getEventNewsById);
router.patch("/:id", updateEventNews);
router.delete("/:id", deleteEventNews);

export default router;
