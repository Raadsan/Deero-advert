import express from "express";
import {
    createTeam,
    getTeams,
    updateTeam,
    deleteTeam
} from "../controllers/teamController.js";
import upload from "../utils/multer.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getTeams);
router.post("/", protect, authorizeMenuAccess("teams"), upload.single('image'), createTeam);
router.patch("/:id", protect, authorizeMenuAccess("teams"), upload.single('image'), updateTeam);
router.put("/:id", protect, authorizeMenuAccess("teams"), upload.single('image'), updateTeam);
router.delete("/:id", protect, authorizeMenuAccess("teams"), deleteTeam);

export default router;
