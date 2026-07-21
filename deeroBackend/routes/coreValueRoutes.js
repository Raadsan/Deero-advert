import express from "express";
import upload from "../utils/multer.js";
import { protect, authorizeMenuAccess } from "../middlewares/authMiddleware.js";
import {
  createCoreValue, getCoreValues, getActiveCoreValues,
  getCoreValueById, updateCoreValue, deleteCoreValue,
} from "../controllers/coreValueController.js";

const router = express.Router();

router.post("/", protect, authorizeMenuAccess("core-values"), upload.fields([{ name: "icon", maxCount: 1 }]), createCoreValue);
router.get("/", getCoreValues);
router.get("/active", getActiveCoreValues);
router.get("/:id", getCoreValueById);
router.put("/:id", protect, authorizeMenuAccess("core-values"), upload.fields([{ name: "icon", maxCount: 1 }]), updateCoreValue);
router.delete("/:id", protect, authorizeMenuAccess("core-values"), deleteCoreValue);

export default router;
