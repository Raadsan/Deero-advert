import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Protected user CRUD routes
router.get("/", protect, getUsers);
router.get("/:id", protect, getUserById);
router.post("/", protect, signup);
router.patch("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

// Public authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
