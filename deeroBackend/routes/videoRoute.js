import express from "express";
import {
  addVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
} from "../controllers/videoController.js";
import upload from "../utils/multer.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("video"), addVideo);
router.get("/", getVideos);
router.get("/:id", getVideoById);
router.patch("/:id", protect, upload.single("video"), updateVideo);
router.delete("/:id", protect, deleteVideo);

export default router;
