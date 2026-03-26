import express from "express";
import upload from "../utils/multer.js"; // your multer file
import {
  createTeam,
  getTeams,
  updateTeam,
  deleteTeam,
} from "../controllers/teamController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// ➕ Create team member
router.post("/", upload.single("image"), createTeam);

// 📥 Get all team members
router.get("/", getTeams);

// ✏ Update team member
router.put("/:id", upload.single("image"), updateTeam);

// ❌ Delete team member
router.delete("/:id", deleteTeam);

export default router;
