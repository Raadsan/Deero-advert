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
      paymentMethod
    } = req.body;

    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) return res.status(404).json({ message: "User not found" });

    let data = {
        userId: user.id,
        amount: parseFloat(amount),
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
      data.packageId = packageId.toString();
      transactionType = "service_payment";
      if (!data.description && selectedPackage) {
        data.description = `Payment for ${service.serviceTitle} - ${selectedPackage.packageTitle}`;
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
        description: data.description
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

    res.json({ success: true, message: "Transaction completed successfully", transaction, paymentResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
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
    res.status(500).json({ message: "Server error" });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: true, service: true, hostingPackage: true }
    });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getTransactionsByUser = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: parseInt(req.params.userId) },
      include: { user: true, service: true, hostingPackage: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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
    const transaction = await prisma.transaction.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
      include: { user: true, service: true, hostingPackage: true }
    });
    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    await prisma.transaction.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getRevenueAnalytics = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const { userId } = req.query;
    
    // Prisma doesn't support $year/$month in groupBy easily for SQLite/MySQL without raw query
    // But I can fetch and aggregate in JS or use raw SQL. 
    // For simplicity and compatibility, I'll fetch and aggregate in JS for now.
    
    const transactions = await prisma.transaction.findMany({
      where: {
        status: "completed",
        createdAt: { gte: sixMonthsAgo },
        userId: userId ? parseInt(userId) : undefined
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
