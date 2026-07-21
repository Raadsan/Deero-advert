import express from "express";
import upload from "../utils/multer.js";
import { protect, authorizeMenuAccess } from "../middlewares/authMiddleware.js";
import {
  createHeroHome,
  getHeroHomes,
  getActiveHeroHomes,
  getHeroHomeById,
  updateHeroHome,
  deleteHeroHome,
} from "../controllers/heroHomeController.js";

const router = express.Router();

router.post("/", protect, authorizeMenuAccess("hero-home"), upload.fields([{ name: "image", maxCount: 1 }]), createHeroHome);
router.get("/", getHeroHomes);
router.get("/active", getActiveHeroHomes);
router.get("/:id", getHeroHomeById);
router.put("/:id", protect, authorizeMenuAccess("hero-home"), upload.fields([{ name: "image", maxCount: 1 }]), updateHeroHome);
router.delete("/:id", protect, authorizeMenuAccess("hero-home"), deleteHeroHome);

export default router;
