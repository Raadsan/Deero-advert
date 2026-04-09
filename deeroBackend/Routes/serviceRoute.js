import express from "express";
import {
    CreateService,
    getALlServices,
    getServicesById,
    updateServiceById,
    deleteServiceById
} from "../controllers/serviceController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.get("/", getALlServices);
router.get("/:_id", getServicesById);

router.post("/", protect, upload.any(), CreateService);
router.post("/create", protect, upload.any(), CreateService);
router.patch("/:id", protect, upload.any(), updateServiceById);
router.delete("/:id", protect, deleteServiceById);

export default router;
