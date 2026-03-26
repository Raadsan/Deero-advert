import express from "express";
import {
    createCareer,
    getAllCareers,
    getActiveCareers,
    getCareerById,
    updateCareer,
    deleteCareer,
} from "../controllers/CareerController.js";

import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", protect, createCareer);
router.get("/", protect, getAllCareers);
router.get("/active", protect, getActiveCareers);
router.get("/:id", protect, getCareerById);
router.patch("/:id", protect, updateCareer);
router.delete("/:id", protect, deleteCareer);

export default router;
