import express from "express";
import upload from "../utils/multer.js";
import {
  signup,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getBonusHistory,
  googleLogin,
  getMe,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Current User Profile
router.get("/me", protect, getMe);

// Bonus History route
router.get("/:id/bonus-history", protect, getBonusHistory);

// Protected user CRUD routes
router.get("/", getUsers);
router.get("/:id", protect, getUserById);
router.post("/", signup);
router.patch("/:id", protect, upload.single("image"), updateUser);
router.delete("/:id", protect, deleteUser);

// Public authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

export default router;
