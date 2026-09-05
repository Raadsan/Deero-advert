import express from "express";
import {
  createTransaction,
  checkoutCart,
  getAllTransactions,
  getTransactionById,
  getTransactionsByUser,
  getTransactionsByType,
  updateTransaction,
  deleteTransaction,
  getRevenueAnalytics
} from "../controllers/transactionController.js";
import { allowSelfOrMenuAccess, authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeMenuAccess("transactions", "transaction"), getAllTransactions);
router.get("/analytics/revenue", protect, authorizeMenuAccess("transactions", "transaction"), getRevenueAnalytics);
router.get("/user/:userId", protect, allowSelfOrMenuAccess("transactions", "transaction"), getTransactionsByUser);
router.get("/type/:type", protect, authorizeMenuAccess("transactions", "transaction"), getTransactionsByType);
router.get("/:id", protect, authorizeMenuAccess("transactions", "transaction"), getTransactionById);

router.post("/", protect, createTransaction);
router.post("/checkout", protect, checkoutCart);
router.patch("/:id", protect, authorizeMenuAccess("transactions", "transaction"), updateTransaction);
router.delete("/:id", protect, authorizeMenuAccess("transactions", "transaction"), deleteTransaction);

export default router;
