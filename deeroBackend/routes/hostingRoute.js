import express from "express";
import {
    createPackage,
    getAllPackages,
    getPackageById,
    updatePackage,
    deletePackage
} from "../controllers/hostingPackageController.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllPackages);
router.get("/:id", getPackageById);

router.post("/", protect, authorizeMenuAccess("hosting"), createPackage);
router.patch("/:id", protect, authorizeMenuAccess("hosting"), updatePackage);
router.delete("/:id", protect, authorizeMenuAccess("hosting"), deletePackage);

export default router;
