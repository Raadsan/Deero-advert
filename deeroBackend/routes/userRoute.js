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
  getCustomerCareUsers,
} from "../controllers/userController.js";
import { allowSelfOrMenuAccess, authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Current User Profile
router.get("/me", protect, getMe);

// Customer Care contacts for mobile app users
router.get("/customer-care", protect, getCustomerCareUsers);

// Bonus History route
router.get("/:id/bonus-history", protect, allowSelfOrMenuAccess("users"), getBonusHistory);

// Protected user CRUD routes
router.get("/", protect, authorizeMenuAccess("users"), getUsers);
router.get("/:id", protect, allowSelfOrMenuAccess("users"), getUserById);
router.post("/", signup);
router.patch("/:id", protect, allowSelfOrMenuAccess("users"), upload.single("image"), updateUser);
router.delete("/:id", protect, authorizeMenuAccess("users"), deleteUser);

// Public authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

export default router;
