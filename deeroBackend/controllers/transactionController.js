import { prisma } from "../lib/prisma.js";
import { sendWaafiPayment } from "../utils/waafiPayment.js";

export const createTransaction = async (req, res) => {
  try {
    const {
      domain,
      serviceId,
      packageId,
      hostingPackageId,
      userId,
      amount,
      description,
      accountNo,
      paymentMethod,
      useBonus // Added useBonus
    } = req.body;

    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const originalAmount = parseFloat(amount);
    let discountApplied = 0;
    let finalAmount = originalAmount;
    let usedDiscountId = null; // Track which flex discount is used

    // Apply Discounts (Bonus or New Flexible Discount)
    if (useBonus && user.bonusStatus === "BonusAvailable") {
      discountApplied = originalAmount / 2; // 50% Bonus Discount
    }

    // Check for Flexible Discounts (Global or User-specific)
    let targetType = "";
    let targetId = "";

    if (domain) {
      targetType = "domain";
      targetId = domain.tld || "all";
    } else if (serviceId) {
      targetType = "service";
      targetId = packageId ? packageId.toString() : "all";
    } else if (hostingPackageId) {
      targetType = "hosting";
      targetId = hostingPackageId.toString();
    }

    const applicableDiscounts = await prisma.discount.findMany({
      where: {
        AND: [
          { status: "active" },
          {
            OR: [
              { userId: user.id },
              { userId: null }
            ]
          },
          {
            OR: [
              { targetType: targetType },
              { targetType: "all" }
            ]
          },
          {
            OR: [
              { targetId: targetId },
              { targetId: "all" },
              { targetId: null }
            ]
          }
        ]
      },
      orderBy: { discountValue: 'desc' } // Take highest discount
    });

    if (applicableDiscounts.length > 0) {
      const bestDiscount = applicableDiscounts[0];
      let flexDiscount = 0;
      if (bestDiscount.discountType === "percentage") {
        flexDiscount = (originalAmount * bestDiscount.discountValue) / 100;
      } else {
        flexDiscount = bestDiscount.discountValue;
      }

      // If flex discount is better than bonus discount, use it. Or if no bonus used.
      if (flexDiscount > discountApplied) {
        discountApplied = flexDiscount;
        if (bestDiscount.userId) {
          usedDiscountId = bestDiscount.id;
        }
      }
    }

    finalAmount = originalAmount - discountApplied;
    if (finalAmount < 0) finalAmount = 0;

    let data = {
      userId: user.id,
      amount: finalAmount,
      originalAmount: originalAmount,
      discountApplied: discountApplied,
      description: description || "",
      status: "pending",
      paymentMethod: paymentMethod || (accountNo ? "waafi" : "mail-in")
    };

    let transactionType = "register";

    if (domain) {
      data.domainName = domain.name;
      transactionType = "register";
      if (!data.description) data.description = `Payment for domain - ${domain.name}`;
    } else if (serviceId) {
      const service = await prisma.service.findUnique({ where: { id: parseInt(serviceId) } });
      if (!service) return res.status(404).json({ message: "Service not found" });

      // packages is Json in Prisma
      const packages = service.packages || [];
      const selectedPackage = packages.find(pkg => (pkg.id || pkg._id) == packageId);

      data.serviceId = service.id;
      data.packageId = packageId ? packageId.toString() : null;
      transactionType = "service_payment";

      if (!data.description || data.description.trim() === "") {
        data.description = `Payment for ${service.serviceTitle}`;
        if (selectedPackage && selectedPackage.packageTitle) {
          data.description += ` - ${selectedPackage.packageTitle}`;
        }
      }
    } else if (hostingPackageId) {
      const pkg = await prisma.hostingPackage.findUnique({ where: { id: parseInt(hostingPackageId) } });
      if (!pkg) return res.status(404).json({ message: "Hosting Package not found" });

      data.hostingPackageId = pkg.id;
      transactionType = "hosting_payment";
      if (!data.description) data.description = `Payment for Hosting - ${pkg.name}`;
    } else {
      return res.status(400).json({ message: "domain, serviceId or hostingPackageId is required" });
    }

    data.type = transactionType;

    let transaction = await prisma.transaction.create({
      data: data,
      include: { user: true, service: true, hostingPackage: true }
    });

    let paymentResponse = { responseCode: "W000" };

    if (accountNo) {
      paymentResponse = await sendWaafiPayment({
        transactionId: transaction.id.toString(),
        accountNo,
        amount: data.amount,
        description: data.description || "Deero Payment"
      });

      const status = paymentResponse.responseCode === "2001" ? "completed" : "failed";
      transaction = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status,
          paymentReferenceId: paymentResponse.referenceId || transaction.id.toString()
        },
        include: { user: true, service: true, hostingPackage: true }
      });
    }

    if (transaction.status === "failed") {
      return res.status(400).json({
        success: false,
        message: `Payment failed: ${paymentResponse.responseMsg || "Unknown error"}`,
        transaction,
        paymentResponse
      });
    }

    // Award bonus points on successful transaction
    if (transaction.status === "completed") {
      const { useBonus } = req.body;
      if (useBonus && user.bonusStatus === "BonusAvailable" && discountApplied === (originalAmount / 2)) {
        // Reset process: Milestone reached and used!
        await prisma.user.update({
          where: { id: user.id },
          data: {
            bonus: 15, // Starting point after claim
            bonusStatus: "BonusNotAvailable",
            bonusHistory: {
              create: {
                amount: 0,
                reason: "Bonus Milestone Claimed - 50% Discount Applied",
                type: "claim"
              }
            }
          }
        });
      } else {
        // If a specific flexible discount was used, mark it as used
        if (usedDiscountId) {
          await prisma.discount.update({
            where: { id: usedDiscountId },
            data: { status: "used" }
          });
        }
        await handleBonusPoints(transaction.userId, transaction.type);
      }
    }

    res.json({ success: true, message: "Transaction completed successfully", transaction, paymentResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * 🎁 BONUS LOGIC HELPER
 */
const handleBonusPoints = async (userId, transactionType) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    // Count all previous COMPLETED transactions for this user
    const completedCount = await prisma.transaction.count({
      where: {
        userId: userId,
        status: "completed"
      }
    });

    let pointsToAdd = 0;
    let reason = "";

    if (completedCount === 1) {
      pointsToAdd = 15;
      reason = "1st Purchase Bonus (+15)";
    } else if (completedCount === 2) {
      pointsToAdd = 30;
      reason = "2nd Purchase Bonus (+30)";
    } else if (completedCount === 3) {
      pointsToAdd = 40;
      reason = "3rd Purchase Bonus (+40)";
    } else {
      // Any further purchases
      pointsToAdd = 10;
      reason = "Additional Purchase Bonus";
    }

    let newBonus = user.bonus + pointsToAdd;
    let finalStatus = user.bonusStatus;

    // Check if milestone 100 is reached
    if (newBonus >= 100) {
      finalStatus = "BonusAvailable";
      newBonus = 100; // Cap at 100 until claimed
      reason = "Milestone Reached! (50% Free Benefit) - Status: BonusAvailable";
    }

    // Update User and Log History
    await prisma.user.update({
      where: { id: userId },
      data: {
        bonus: newBonus,
        bonusStatus: finalStatus,
        bonusHistory: {
          create: {
            amount: pointsToAdd,
            reason: reason,
            type: "add"
          }
        }
      }
    });
  } catch (error) {
    console.error("Bonus Error:", error);
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { user: true, service: true, hostingPackage: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, transactions });
  } catch (err) {
    console.error("Error in getAllTransactions:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid transaction ID" });

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { user: true, service: true, hostingPackage: true }
    });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ success: true, transaction });
  } catch (err) {
    console.error("Error in getTransactionById:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getTransactionsByUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { user: true, service: true, hostingPackage: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, transactions });
  } catch (err) {
    console.error("Error in getTransactionsByUser:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getTransactionsByType = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { type: req.params.type },
      include: { user: true, service: true, hostingPackage: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid transaction ID" });

    const transaction = await prisma.transaction.update({
      where: { id },
      data: req.body,
      include: { user: true, service: true, hostingPackage: true }
    });
    res.json({ success: true, transaction });
  } catch (err) {
    console.error("Error in updateTransaction:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid transaction ID" });

    await prisma.transaction.delete({ where: { id } });
    res.json({ success: true, message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error in deleteTransaction:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getRevenueAnalytics = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const { userId: userIdQuery } = req.query;
    let userId = undefined;

    if (userIdQuery && userIdQuery !== 'null' && userIdQuery !== 'undefined') {
      userId = parseInt(userIdQuery);
      if (isNaN(userId)) {
        console.warn(`getRevenueAnalytics: Invalid userId query received: "${userIdQuery}"`);
        userId = undefined;
      }
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        status: "completed",
        createdAt: { gte: sixMonthsAgo },
        userId: userId
      },
      select: { amount: true, createdAt: true }
    });

    const formattedData = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let currentDate = new Date(sixMonthsAgo);
    const now = new Date();

    while (currentDate <= now) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const monthRevenue = transactions
        .filter(t => t.createdAt.getFullYear() === year && t.createdAt.getMonth() === month)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      formattedData.push({
        label: months[month],
        year: year,
        revenue: monthRevenue
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    res.json({ success: true, data: formattedData.slice(-6) });
  } catch (err) {
    console.error("Error in getRevenueAnalytics:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
