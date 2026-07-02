import express from "express";
import {
    CreateService,
    getALlServices,
    getServicesById,
    updateServiceById,
    deleteServiceById
} from "../controllers/serviceController.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.get("/", getALlServices);
router.get("/:_id", getServicesById);

router.post("/", protect, authorizeMenuAccess("services"), upload.any(), CreateService);
router.post("/create", protect, authorizeMenuAccess("services"), upload.any(), CreateService);
router.patch("/:id", protect, authorizeMenuAccess("services"), upload.any(), updateServiceById);
router.delete("/:id", protect, authorizeMenuAccess("services"), deleteServiceById);

export default router;
