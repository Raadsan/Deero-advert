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

const router = express.Router();

// Main menu routes
router.post("/", createMenu);
router.get("/", getMenus);
router.get("/:id", getMenuById);
router.patch("/:id", updateMenu);
router.delete("/:id", deleteMenu);

// SubMenu routes
router.post("/:id/submenu", addSubMenu);
router.patch("/:menuId/submenu/:subMenuId", updateSubMenu);
router.delete("/:menuId/submenu/:subMenuId", deleteSubMenu);

// Get user-specific menus based on role
router.get("/user/:roleId", getUserMenus);

export default router;
