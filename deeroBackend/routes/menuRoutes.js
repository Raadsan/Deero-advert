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

router.get("/", getMenus);
router.get("/user/:roleId", getUserMenus);
router.get("/:id", getMenuById);

router.post("/", protect, createMenu);
router.patch("/:id", protect, updateMenu);
router.delete("/:id", protect, deleteMenu);

router.post("/:id/submenu", protect, addSubMenu);
router.patch("/:menuId/submenu/:subMenuId", protect, updateSubMenu);
router.delete("/:menuId/submenu/:subMenuId", protect, deleteSubMenu);

export default router;
