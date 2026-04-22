import express from "express";
import {
  createOrUpdatePermission,
  getAllPermissions,
  getPermissionsByRole,
  addMenuAccess,
  removeMenuAccess
} from "../controllers/RolePermissionsController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllPermissions);
router.get("/role/:roleId", protect, getPermissionsByRole);

router.post("/", protect, createOrUpdatePermission);
router.post("/role/:roleId/add-menu", protect, addMenuAccess);
router.delete("/role/:roleId/menu/:menuId", protect, removeMenuAccess);

export default router;
