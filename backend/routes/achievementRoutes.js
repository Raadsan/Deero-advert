import express from "express";
import upload from "../utils/multer.js"; // 👈 your existing multer
import {
  addAchievement,
  getAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement
} from "../controllers/achievementController.js";

const router = express.Router();

// POST - add achievement with icon upload
router.post("/", upload.single("icon"), addAchievement);

// GET - all achievements
router.get("/", getAchievements);

// GET - achievement by ID
router.get("/:id", getAchievementById);

// PATCH/PUT - update achievement (icon upload is optional)
router.patch("/:id", upload.single("icon"), updateAchievement);
router.put("/:id", upload.single("icon"), updateAchievement);

// DELETE - achievement
router.delete("/:id", deleteAchievement);

export default router;
