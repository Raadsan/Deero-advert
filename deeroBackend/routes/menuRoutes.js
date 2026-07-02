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
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getMenus);
router.get("/user/:roleId", getUserMenus);
router.get("/:id", getMenuById);

router.post("/", protect, authorizeMenuAccess("menus", "roles"), createMenu);
router.patch("/:id", protect, authorizeMenuAccess("menus", "roles"), updateMenu);
router.delete("/:id", protect, authorizeMenuAccess("menus", "roles"), deleteMenu);

router.post("/:id/submenu", protect, authorizeMenuAccess("menus", "roles"), addSubMenu);
router.patch("/:menuId/submenu/:subMenuId", protect, authorizeMenuAccess("menus", "roles"), updateSubMenu);
router.delete("/:menuId/submenu/:subMenuId", protect, authorizeMenuAccess("menus", "roles"), deleteSubMenu);

export default router;
