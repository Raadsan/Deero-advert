import express from "express";
import upload from "../utils/multer.js"; // 👈 your existing multer
import {
  addAchievement,
  getAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement
} from "../controllers/achievementController.js";

import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// POST - add achievement with icon upload
router.post("/", protect, upload.single("icon"), addAchievement);

// GET - all achievements
router.get("/", protect, getAchievements);

// GET - achievement by ID
router.get("/:id", protect, getAchievementById);

// PATCH/PUT - update achievement (icon upload is optional)
router.patch("/:id", protect, upload.single("icon"), updateAchievement);


// DELETE - achievement
router.delete("/:id", protect, deleteAchievement);

export default router;
