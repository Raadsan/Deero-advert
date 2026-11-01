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

router.get("/", protect, authorizeMenuAccess("transactions", "transaction", "reports", "report"), getAllTransactions);
// Staff with transactions menu, OR a user requesting their own analytics via ?userId=
router.get("/analytics/revenue", protect, allowSelfOrMenuAccess("transactions", "transaction", "reports", "report"), getRevenueAnalytics);
router.get("/user/:userId", protect, allowSelfOrMenuAccess("transactions", "transaction", "reports", "report"), getTransactionsByUser);
router.get("/type/:type", protect, authorizeMenuAccess("transactions", "transaction", "reports", "report"), getTransactionsByType);
router.get("/:id", protect, authorizeMenuAccess("transactions", "transaction", "reports", "report"), getTransactionById);

router.post("/", protect, createTransaction);
router.post("/checkout", protect, checkoutCart);
router.patch("/:id", protect, authorizeMenuAccess("transactions", "transaction"), updateTransaction);
router.delete("/:id", protect, authorizeMenuAccess("transactions", "transaction"), deleteTransaction);

export default router;
