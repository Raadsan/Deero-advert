import express from "express";
import upload from "../utils/multer.js";
import { protect, authorizeMenuAccess } from "../middlewares/authMiddleware.js";
import {
  createApproach, getApproaches, getActiveApproaches,
  getApproachById, updateApproach, deleteApproach,
} from "../controllers/approachController.js";

const router = express.Router();

router.post("/", protect, authorizeMenuAccess("approaches"), upload.fields([{ name: "icon", maxCount: 1 }]), createApproach);
router.get("/", getApproaches);
router.get("/active", getActiveApproaches);
router.get("/:id", getApproachById);
router.put("/:id", protect, authorizeMenuAccess("approaches"), upload.fields([{ name: "icon", maxCount: 1 }]), updateApproach);
router.delete("/:id", protect, authorizeMenuAccess("approaches"), deleteApproach);

export default router;
