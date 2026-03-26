import express from "express";
import {
  createRole, getRoles, getRoleById, updateRole, deleteRole
} from "../controllers/roleController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", createRole);
router.get("/", getRoles);
router.get("/:id", protect, getRoleById);
router.patch("/:id", protect, updateRole);
router.delete("/:id", protect, deleteRole);

export default router;
