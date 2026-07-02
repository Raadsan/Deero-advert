import express from "express";
import {
    createCareer,
    getAllCareers,
    getActiveCareers,
    getCareerById,
    updateCareer,
    deleteCareer
} from "../controllers/CareerController.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/active", getActiveCareers);
router.get("/", getAllCareers);
router.get("/:id", getCareerById);

router.post("/", protect, authorizeMenuAccess("careers", "career"), createCareer);
router.patch("/:id", protect, authorizeMenuAccess("careers", "career"), updateCareer);
router.delete("/:id", protect, authorizeMenuAccess("careers", "career"), deleteCareer);

export default router;
