import express from "express";
import {
  createRole, getRoles, getRoleById, updateRole, deleteRole
} from "../controllers/roleController.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", protect, authorizeMenuAccess("roles"), getRoles);
router.get("/:id", protect, authorizeMenuAccess("roles"), getRoleById);

router.post("/", protect, authorizeMenuAccess("roles"), createRole);
router.patch("/:id", protect, authorizeMenuAccess("roles"), updateRole);
router.delete("/:id", protect, authorizeMenuAccess("roles"), deleteRole);

export default router;
