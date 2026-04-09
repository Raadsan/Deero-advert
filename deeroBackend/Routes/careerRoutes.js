import express from "express";
import {
    createCareer,
    getAllCareers,
    getActiveCareers,
    getCareerById,
    updateCareer,
    deleteCareer
} from "../controllers/CareerController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/active", getActiveCareers);
router.get("/", getAllCareers);
router.get("/:id", getCareerById);

router.post("/", protect, createCareer);
router.patch("/:id", protect, updateCareer);
router.delete("/:id", protect, deleteCareer);

export default router;
