// routes/transactionRoutes.js
import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionsByUser,
  getTransactionsByType,
  updateTransaction,
  deleteTransaction,
  getRevenueAnalytics
} from "../controllers/transactionController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// CREATE
router.post("/", protect, createTransaction);

// READ all transactions
router.get("/", protect, getAllTransactions);

// READ transaction by ID
// Analytics Route (Must be before /:id)
router.get("/analytics/revenue", protect, getRevenueAnalytics);

router.get("/:id", protect, getTransactionById);

// READ transactions by user
router.get("/user/:userId", protect, getTransactionsByUser);

// READ transactions by type
router.get("/type/:type", protect, getTransactionsByType);

// UPDATE transaction
router.put("/:id", protect, updateTransaction);

// DELETE transaction
router.delete("/:id", protect, deleteTransaction);

export default router;
