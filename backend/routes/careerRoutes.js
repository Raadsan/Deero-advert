import express from "express";
import {
    createCareer,
    getAllCareers,
    getActiveCareers,
    getCareerById,
    updateCareer,
    deleteCareer,
} from "../controllers/CareerController.js";

const router = express.Router();

router.post("/", createCareer);
router.get("/", getAllCareers);
router.get("/active", getActiveCareers);
router.get("/:id", getCareerById);
router.patch("/:id", updateCareer);
router.delete("/:id", deleteCareer);

export default router;
