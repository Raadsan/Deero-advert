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

const router = express.Router();

// CREATE
router.post("/", createTransaction);

// READ all transactions
router.get("/", getAllTransactions);

// READ transaction by ID
// Analytics Route (Must be before /:id)
router.get("/analytics/revenue", getRevenueAnalytics);

router.get("/:id", getTransactionById);

// READ transactions by user
router.get("/user/:userId", getTransactionsByUser);

// READ transactions by type
router.get("/type/:type", getTransactionsByType);

// UPDATE transaction
router.put("/:id", updateTransaction);

// DELETE transaction
router.delete("/:id", deleteTransaction);

export default router;
