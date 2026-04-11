import express from "express";
import {
  addAchievement,
  getAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement
} from "../controllers/achievementController.js";
import upload from "../utils/multer.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single('icon'), addAchievement);
router.get("/", getAchievements);
router.get("/:id", getAchievementById);
router.patch("/:id", protect, upload.single('icon'), updateAchievement);
router.delete("/:id", protect, deleteAchievement);

export default router;
