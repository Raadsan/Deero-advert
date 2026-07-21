import express from "express";
import upload from "../utils/multer.js";
import { protect, authorizeMenuAccess } from "../middlewares/authMiddleware.js";
import {
  createVisionMission, getVisionMissions, getActiveVisionMissions,
  getVisionMissionById, updateVisionMission, deleteVisionMission,
} from "../controllers/visionMissionController.js";

const router = express.Router();

router.post("/", protect, authorizeMenuAccess("vision-mission"), upload.fields([{ name: "icon", maxCount: 1 }]), createVisionMission);
router.get("/", getVisionMissions);
router.get("/active", getActiveVisionMissions);
router.get("/:id", getVisionMissionById);
router.put("/:id", protect, authorizeMenuAccess("vision-mission"), upload.fields([{ name: "icon", maxCount: 1 }]), updateVisionMission);
router.delete("/:id", protect, authorizeMenuAccess("vision-mission"), deleteVisionMission);

export default router;
