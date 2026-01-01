import express from "express";
import {
  createOrUpdatePermission,
  getAllPermissions,
  getPermissionsByRole,
  getPermissionById,
  addMenuAccess,
  removeMenuAccess,
  deletePermission
} from "../controllers/RolePermissionsController.js";

const router = express.Router();

// Create or update permissions for a role
router.post("/", createOrUpdatePermission);
router.put("/", createOrUpdatePermission);

// Get all permissions
router.get("/", getAllPermissions);

// Get permissions by role ID
router.get("/role/:roleId", getPermissionsByRole);

// Get permission by ID
router.get("/:id", getPermissionById);

// Add menu access to a role
router.post("/role/:roleId/menu", addMenuAccess);

// Remove menu access from a role
router.delete("/role/:roleId/menu/:menuId", removeMenuAccess);

// Delete permission
router.delete("/:id", deletePermission);

export default router;
