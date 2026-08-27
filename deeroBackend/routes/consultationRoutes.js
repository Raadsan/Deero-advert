import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createConsultation,
  getConsultations,
  updateConsultationStatus,
  deleteConsultation,
} from "../controllers/consultationController.js";

const router = express.Router();

router.post("/", createConsultation);
router.get("/", protect, getConsultations);
router.patch("/:id", protect, updateConsultationStatus);
router.delete("/:id", protect, deleteConsultation);

export default router;
