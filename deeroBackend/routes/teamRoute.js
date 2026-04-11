import express from "express";
import {
    createTeam,
    getTeams,
    updateTeam,
    deleteTeam
} from "../controllers/teamController.js";
import upload from "../utils/multer.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getTeams);
router.post("/", protect, upload.single('image'), createTeam);
router.patch("/:id", protect, upload.single('image'), updateTeam);
router.put("/:id", protect, upload.single('image'), updateTeam);
router.delete("/:id", protect, deleteTeam);

export default router;
