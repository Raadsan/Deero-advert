import express from "express";
import {
  createMenu, getMenus, getMenuById, updateMenu, deleteMenu, getUserMenus
} from "../controllers/menuController.js";

const router = express.Router();

router.post("/", createMenu);
router.get("/", getMenus);
router.get("/my-menus", getUserMenus);
router.get("/:id", getMenuById);
router.put("/:id", updateMenu);
router.delete("/:id", deleteMenu);

export default router;
