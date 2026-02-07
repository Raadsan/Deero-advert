import Transaction from "../models/TransactionModel.js";

import User from "../models/UserModel.js";
import mongoose from "mongoose";
import { sendWaafiPayment } from "../utils/waafiPayment.js";


import Service from "../models/serviceModel.js";

export const createTransaction = async (req, res) => {
  try {
    const {
      domain, // ✅ direct domain object
      serviceId,
      packageId,
      hostingPackageId,
      userId,
      amount,
      description,
      accountNo,
      paymentMethod
    } = req.body;

    console.log("Create Transaction Request Body:", JSON.stringify(req.body, null, 2));

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let relatedEntity = {};
    let transactionType = "register";
    let transactionDescription = description;

    /* ================= DOMAIN ================= */
    if (domain) {
      // Direct storage of domain name
      relatedEntity = { domainName: domain.name };
      transactionType = "register";

      if (!transactionDescription && domain.name) {
        transactionDescription = `Payment for domain - ${domain.name}`;
      }
    }

    /* ================= SERVICE ================= */
    else if (serviceId) {
      const service = await Service.findById(serviceId);
      if (!service) return res.status(404).json({ message: "Service not found" });

      const selectedPackage = service.packages.find(
        pkg => pkg._id.toString() === packageId
      );
      if (!selectedPackage) {
        return res.status(404).json({ message: "Package not found in this service" });
      }

      relatedEntity = { service: service._id, packageId };
      transactionType = "service_payment";

      if (!transactionDescription) {
        transactionDescription = `Payment for ${service.serviceTitle} - ${selectedPackage.packageTitle}`;
      }
    }

    /* ================= HOSTING ================= */
    else if (hostingPackageId) {
      const HostingPackage = (await import("../models/HostingPackage.js")).default;
      const pkg = await HostingPackage.findById(hostingPackageId);
      if (!pkg) return res.status(404).json({ message: "Hosting Package not found" });

      relatedEntity = { hostingPackage: pkg._id };
      transactionType = "hosting_payment";

      if (!transactionDescription) {
        transactionDescription = `Payment for Hosting - ${pkg.name}`;
      }
    }

    else {
      return res.status(400).json({
        message: "domain, serviceId or hostingPackageId is required"
      });
    }

    /* ============ CREATE TRANSACTION ============ */
    const transaction = await Transaction.create({
      ...relatedEntity,
      user: user._id,
      type: transactionType,
      amount,
      status: "pending",
      description: transactionDescription,
      paymentMethod: paymentMethod || (accountNo ? "waafi" : "mail-in")
    });

    /* =============== PAYMENT ================= */
    let paymentResponse = { responseCode: "W000" };

    if (accountNo) {
      paymentResponse = await sendWaafiPayment({
        transactionId: transaction._id.toString(),
        accountNo,
        amount,
        description: transactionDescription
      });
    }

    /* ============ UPDATE STATUS ============ */
    if (accountNo) {
      transaction.status =
        paymentResponse.responseCode === "2001" ? "completed" : "failed";
    } else {
      transaction.status = "pending";
    }

    transaction.paymentReferenceId =
      paymentResponse.referenceId || transaction._id.toString();

    await transaction.save();

    /* =============== POPULATE ================= */
    await transaction.populate([
      { path: "user", select: "fullname email" },
      { path: "service", select: "serviceTitle" },
      // Domain is now just a string field, no populate needed
      { path: "hostingPackage", select: "name" }
    ]);

    /* ============== FAILED ================= */
    if (transaction.status === "failed") {
      return res.status(400).json({
        success: false,
        message: `Payment failed: ${paymentResponse.responseMsg || "Unknown error"}`,
        transaction,
        paymentResponse
      });
    }

    /* ============== SUCCESS ================= */
    res.json({
      success: true,
      message: "Transaction completed successfully",
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
      // .populate("domain", "name status expiryDate price") // Removed
      .populate("service", "serviceTitle packages")
      .populate("hostingPackage", "name price")
      .populate("user", "fullname email phone")
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

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ message: "Invalid transaction ID format" });
    }

    const transaction = await Transaction.findById(transactionId)
      // .populate("domain", "name status expiryDate price") // Removed
      .populate("service", "serviceTitle packages")
      .populate("hostingPackage", "name price")
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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const transactions = await Transaction.find({ user: userId })
      // .populate("domain", "name status expiryDate price") // Removed
      .populate("service", "serviceTitle packages")
      .populate("hostingPackage", "name price")
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
      .populate("service", "serviceTitle packages")
      .populate("hostingPackage", "name price")
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

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ message: "Invalid transaction ID format" });
    }

    const transaction = await Transaction.findByIdAndUpdate(transactionId, updates, { new: true })
      .populate("service", "serviceTitle packages")
      .populate("hostingPackage", "name price")
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

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ message: "Invalid transaction ID format" });
    }

    const transaction = await Transaction.findByIdAndDelete(transactionId);

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.json({ success: true, message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Delete transaction error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Revenue Analytics
export const getRevenueAnalytics = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start from the 1st of that month

    const { userId } = req.query; // Check for userId query param

    const matchStage = {
      status: "completed",
      createdAt: { $gte: sixMonthsAgo }
    };

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }
      matchStage.user = new mongoose.Types.ObjectId(userId);
    }

    const revenueData = await Transaction.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalRevenue: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Format the result to be more frontend-friendly (e.g., fill in missing months with 0)
    const formattedData = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let currentDate = new Date(sixMonthsAgo);
    const now = new Date();

    while (currentDate <= now) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // 1-indexed for comparison

      const found = revenueData.find(d => d._id.year === year && d._id.month === month);

      formattedData.push({
        label: months[month - 1],
        year: year,
        revenue: found ? found.totalRevenue : 0
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    // Ensure we only keep the last 6 entries if logic spills over
    const finalData = formattedData.slice(-6);

    res.json({ success: true, data: finalData });
  } catch (err) {
    console.error("Revenue analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
};