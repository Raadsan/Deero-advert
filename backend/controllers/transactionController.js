import Transaction from "../models/TransactionModel.js";
import Domain from "../models/domainModel.js";
import User from "../models/UserModel.js";
import { sendWaafiPayment } from "../utils/waafiPayment.js";


export const createTransaction = async (req, res) => {
  try {
    const { domainId, userId, amount, description, accountNo } = req.body;

    const domain = await Domain.findById(domainId);
    if (!domain) return res.status(404).json({ message: "Domain not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create pending transaction
    const transaction = await Transaction.create({
      domain: domain._id,
      user: user._id,
      type: "register",
      amount,
      status: "pending",
      description
    });

    // Call WAAFI Pay API
    const paymentResponse = await sendWaafiPayment({
      transactionId: transaction._id.toString(),
      accountNo,
      amount,
      description
    });

    // Update status based on responseCode from WaafiPay
    // "2001" is RCS_SUCCESS in WaafiPay
    if (paymentResponse.responseCode === "2001") {
      transaction.status = "completed";
    } else {
      transaction.status = "failed";
    }

    // Save referenceId from WAAFI and updated status
    transaction.paymentReferenceId = paymentResponse.referenceId || transaction._id.toString();
    await transaction.save();

    res.json({
      success: true,
      message: (paymentResponse.responseCode === "2001")
        ? "Payment successful and transaction completed"
        : `Payment failed: ${paymentResponse.responseMsg || "Unknown error"}`,
      transaction,
      paymentResponse
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// Get All Transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("domain", "name status expiryDate")
      .populate("user", "fullname email")
      .sort({ createdAt: -1 });

    res.json({ success: true, transactions });
  } catch (err) {
    console.error("Get all transactions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const transaction = await Transaction.findById(transactionId)
      .populate("domain", "name status expiryDate")
      .populate("user", "fullname email");

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.json({ success: true, transaction });
  } catch (err) {
    console.error("Get transaction by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Transactions by User
export const getTransactionsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactions = await Transaction.find({ user: userId })
      .populate("domain", "name status expiryDate")
      .populate("user", "fullname email")
      .sort({ createdAt: -1 });

    res.json({ success: true, transactions });
  } catch (err) {
    console.error("Get transactions by user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Transactions by Type
export const getTransactionsByType = async (req, res) => {
  try {
    const type = req.params.type;
    const transactions = await Transaction.find({ type })
      .populate("domain", "name status expiryDate")
      .populate("user", "fullname email")
      .sort({ createdAt: -1 });

    res.json({ success: true, transactions });
  } catch (err) {
    console.error("Get transactions by type error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Transaction
export const updateTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const updates = req.body;

    const transaction = await Transaction.findByIdAndUpdate(transactionId, updates, { new: true })
      .populate("domain", "name status expiryDate")
      .populate("user", "fullname email");

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.json({ success: true, transaction });
  } catch (err) {
    console.error("Update transaction error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const transaction = await Transaction.findByIdAndDelete(transactionId);

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.json({ success: true, message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Delete transaction error:", err);
    res.status(500).json({ message: "Server error" });
  }
};