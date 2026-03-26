import express from "express";
import {
  createMenu,
  getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  addSubMenu,
  updateSubMenu,
  deleteSubMenu,
  getUserMenus
} from "../controllers/menuController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Main menu routes
router.post("/", protect, createMenu);
router.get("/", protect, getMenus);
router.get("/:id", protect, getMenuById);
router.patch("/:id", protect, updateMenu);
router.delete("/:id", protect, deleteMenu);

// SubMenu routes
router.post("/:id/submenu", protect, addSubMenu);
router.patch("/:menuId/submenu/:subMenuId", protect, updateSubMenu);
router.delete("/:menuId/submenu/:subMenuId", protect, deleteSubMenu);

// Get user-specific menus based on role
router.get("/user/:roleId", protect, getUserMenus);

export default router;
