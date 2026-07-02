import express from "express";
import {
  addAchievement,
  getAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement
} from "../controllers/achievementController.js";
import upload from "../utils/multer.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeMenuAccess("achievements"), upload.single('icon'), addAchievement);
router.get("/", getAchievements);
router.get("/:id", getAchievementById);
router.patch("/:id", protect, authorizeMenuAccess("achievements"), upload.single('icon'), updateAchievement);
router.delete("/:id", protect, authorizeMenuAccess("achievements"), deleteAchievement);

export default router;
