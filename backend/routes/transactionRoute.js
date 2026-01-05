// routes/transactionRoutes.js
import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionsByUser,
  getTransactionsByType,
  updateTransaction,
  deleteTransaction
} from "../controllers/transactionController.js";

const router = express.Router();

// CREATE
router.post("/", createTransaction);

// READ all transactions
router.get("/", getAllTransactions);

// READ transactions by user
router.get("/user/:userId", getTransactionsByUser);

// READ transactions by type
router.get("/type/:type", getTransactionsByType);

// UPDATE transaction
router.put("/:transactionId", updateTransaction);

// DELETE transaction
router.delete("/:transactionId", deleteTransaction);

export default router;
