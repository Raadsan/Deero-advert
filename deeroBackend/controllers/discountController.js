import { prisma } from "../lib/prisma.js";

// Create a new discount
export const createDiscount = async (req, res) => {
  try {
    const {
      userId,
      targetType,
      targetId,
      discountValue,
      discountType,
      platform,
      status,
      startDate,
      endDate
    } = req.body;

    const discount = await prisma.discount.create({
      data: {
        userId: userId ? parseInt(userId) : null,
        targetType,
        targetId: targetId ? targetId.toString() : null,
        discountValue: parseFloat(discountValue),
        discountType: discountType || "percentage",
        platform: platform || "all",
        status: status || "active",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });

    res.json({ success: true, message: "Discount created successfully", discount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Public: active "All Users" discounts (no login required)
export const getPublicDiscounts = async (req, res) => {
  try {
    const now = new Date();
    const { platform } = req.query; // 'app', 'website', or 'all'
    const platformFilter = platform && platform !== 'all'
      ? { platform: { in: [platform, 'all'] } }
      : {};

    const discounts = await prisma.discount.findMany({
      where: {
        userId: null,
        status: "active",
        ...platformFilter,
        AND: [
          {
            OR: [
              { startDate: null },
              { startDate: { lte: now } },
            ],
          },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      orderBy: { discountValue: "desc" },
    });
    res.json({ success: true, discounts });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all discounts (for admin)
export const getAllDiscounts = async (req, res) => {
  try {
    const { targetType, targetId, platform, status } = req.query;
    const where = {};

    if (targetType) where.targetType = targetType;
    if (targetId) where.targetId = targetId.toString();
    if (status) where.status = status;
    if (platform && platform !== 'all') {
      where.platform = { in: [platform, 'all'] };
    }

    const discounts = await prisma.discount.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, discounts });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Check active discount for a specific target item
export const getDiscountByTarget = async (req, res) => {
  try {
    const { targetType, targetId } = req.query;
    if (!targetType || !targetId) {
      return res.status(400).json({ message: "targetType and targetId are required" });
    }

    const discount = await prisma.discount.findFirst({
      where: {
        targetType,
        targetId: targetId.toString(),
        status: "active"
      },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, discount });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get discounts for a specific user
export const getUserDiscounts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { platform } = req.query;
    const platformFilter = platform && platform !== 'all'
      ? { platform: { in: [platform, 'all'] } }
      : {};

    const discounts = await prisma.discount.findMany({
      where: {
        OR: [
          { userId: parseInt(userId) },
          { userId: null } // Global discounts
        ],
        status: "active",
        ...platformFilter
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, discounts });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update discount (full update or status update)
export const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      discountValue,
      discountType,
      platform,
      userId,
      startDate,
      endDate,
      targetType,
      targetId
    } = req.body;

    const data = {};
    if (status !== undefined) data.status = status;
    if (discountValue !== undefined) data.discountValue = parseFloat(discountValue);
    if (discountType !== undefined) data.discountType = discountType;
    if (platform !== undefined) data.platform = platform;
    if (userId !== undefined) data.userId = userId ? parseInt(userId) : null;
    if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null;
    if (targetType !== undefined) data.targetType = targetType;
    if (targetId !== undefined) data.targetId = targetId ? targetId.toString() : null;

    const discount = await prisma.discount.update({
      where: { id: parseInt(id) },
      data
    });

    res.json({ success: true, message: "Discount updated successfully", discount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateDiscountStatus = updateDiscount;

// Delete a discount
export const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.discount.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: "Discount deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
