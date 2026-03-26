import express from "express";
import {
  createRole, getRoles, getRoleById, updateRole, deleteRole
} from "../controllers/roleController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", createRole);
router.get("/", getRoles);
router.get("/:id", getRoleById);
router.patch("/:id", updateRole);
router.delete("/:id", deleteRole);

export default router;
