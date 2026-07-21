import express from "express";
import upload from "../utils/multer.js";
import { protect, authorizeMenuAccess } from "../middlewares/authMiddleware.js";
import {
  createHeroAbout,
  getHeroAbouts,
  getActiveHeroAbout,
  getHeroAboutById,
  updateHeroAbout,
  deleteHeroAbout,
} from "../controllers/heroAboutController.js";

const router = express.Router();

router.post("/", protect, authorizeMenuAccess("hero-about"), upload.fields([{ name: "watermarkImage", maxCount: 1 }]), createHeroAbout);
router.get("/", getHeroAbouts);
router.get("/active", getActiveHeroAbout);
router.get("/:id", getHeroAboutById);
router.put("/:id", protect, authorizeMenuAccess("hero-about"), upload.fields([{ name: "watermarkImage", maxCount: 1 }]), updateHeroAbout);
router.delete("/:id", protect, authorizeMenuAccess("hero-about"), deleteHeroAbout);

export default router;
