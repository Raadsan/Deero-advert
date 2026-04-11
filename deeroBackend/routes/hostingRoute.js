import express from "express";
import {
    createPackage,
    getAllPackages,
    getPackageById,
    updatePackage,
    deletePackage
} from "../controllers/hostingPackageController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllPackages);
router.get("/:id", getPackageById);

router.post("/", protect, createPackage);
router.patch("/:id", protect, updatePackage);
router.delete("/:id", protect, deletePackage);

export default router;
