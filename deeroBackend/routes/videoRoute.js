import express from "express";
import {
  addVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
} from "../controllers/videoController.js";
import upload from "../utils/multer.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeMenuAccess("videos", "video"), upload.single("video"), addVideo);
router.get("/", getVideos);
router.get("/:id", getVideoById);
router.patch("/:id", protect, authorizeMenuAccess("videos", "video"), upload.single("video"), updateVideo);
router.delete("/:id", protect, authorizeMenuAccess("videos", "video"), deleteVideo);

export default router;
