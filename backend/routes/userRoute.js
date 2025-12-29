import express from "express";
import {
  signup,
  login,
  forgotPassword,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import router from "./menuRoutes.js";

// Protected user CRUD routes
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

export default router;
