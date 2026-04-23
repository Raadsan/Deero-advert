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

// Get all discounts (for admin)
export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await prisma.discount.findMany({
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

// Get discounts for a specific user
export const getUserDiscounts = async (req, res) => {
  try {
    const { userId } = req.params;
    const discounts = await prisma.discount.findMany({
      where: {
        OR: [
          { userId: parseInt(userId) },
          { userId: null } // Global discounts
        ],
        status: "active"
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, discounts });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update discount status
export const updateDiscountStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const discount = await prisma.discount.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json({ success: true, message: "Discount updated", discount });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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
