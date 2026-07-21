import express from "express";
import upload from "../utils/multer.js";
import { protect, authorizeMenuAccess } from "../middlewares/authMiddleware.js";
import {
  createAward, getAwards, getActiveAwards,
  getAwardById, updateAward, deleteAward,
} from "../controllers/awardController.js";

const router = express.Router();

router.post("/", protect, authorizeMenuAccess("awards"), upload.fields([{ name: "image", maxCount: 1 }]), createAward);
router.get("/", getAwards);
router.get("/active", getActiveAwards);
router.get("/:id", getAwardById);
router.put("/:id", protect, authorizeMenuAccess("awards"), upload.fields([{ name: "image", maxCount: 1 }]), updateAward);
router.delete("/:id", protect, authorizeMenuAccess("awards"), deleteAward);

export default router;
