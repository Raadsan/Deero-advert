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

router.get("/", protect, getAllTransactions);
router.get("/analytics/revenue", protect, getRevenueAnalytics);
router.get("/user/:userId", protect, getTransactionsByUser);
router.get("/type/:type", protect, getTransactionsByType);
router.get("/:id", protect, getTransactionById);

router.post("/", protect, createTransaction);
router.patch("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);

export default router;
