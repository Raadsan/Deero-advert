import express from "express";
import {
  createOrUpdatePermission,
  getAllPermissions,
  getPermissionsByRole,
  addMenuAccess,
  removeMenuAccess
} from "../controllers/RolePermissionsController.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeMenuAccess("roles", "role permissions"), getAllPermissions);
router.get("/role/:roleId", protect, authorizeMenuAccess("roles", "role permissions"), getPermissionsByRole);

router.post("/", protect, authorizeMenuAccess("roles", "role permissions"), createOrUpdatePermission);
router.post("/role/:roleId/add-menu", protect, authorizeMenuAccess("roles", "role permissions"), addMenuAccess);
router.delete("/role/:roleId/menu/:menuId", protect, authorizeMenuAccess("roles", "role permissions"), removeMenuAccess);

export default router;
