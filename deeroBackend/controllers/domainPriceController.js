import { prisma } from "../lib/prisma.js";

const normalizeTLD = (tld) => {
  if (!tld || typeof tld !== "string") return "";
  const clean = tld.trim().toLowerCase();
  return clean.startsWith(".") ? clean : `.${clean}`;
};

// CREATE DOMAIN PRICE
export const createDomainPrice = async (req, res) => {
  try {
    const { tld, price, isActive } = req.body;
    const normalizedTLD = normalizeTLD(tld);

    if (!normalizedTLD) return res.status(400).json({ success: false, message: "TLD is required" });
    if (price === undefined || price === null || price === "" || Number(price) < 0) {
      return res.status(400).json({ success: false, message: "Valid price is required" });
    }

    const domainPrice = await prisma.domainPrice.create({
      data: {
        tld: normalizedTLD,
        price: Number(price),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return res.status(201).json({ success: true, message: "Domain price created successfully", data: domainPrice });
  } catch (error) {
    if (error.code === 'P2002') return res.status(409).json({ success: false, message: "TLD already exists" });
    return res.status(500).json({ success: false, message: "Failed to create domain price", error: error.message });
  }
};

// GET ALL DOMAIN PRICES
export const getAllDomainPrices = async (req, res) => {
  try {
    const domainPrices = await prisma.domainPrice.findMany({ orderBy: { tld: 'asc' } });
    return res.status(200).json({ success: true, count: domainPrices.length, data: domainPrices });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch domain prices", error: error.message });
  }
};

// GET SINGLE DOMAIN PRICE BY ID
export const getDomainPriceById = async (req, res) => {
  try {
    const domainPrice = await prisma.domainPrice.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!domainPrice) return res.status(404).json({ success: false, message: "Domain price not found" });
    return res.status(200).json({ success: true, data: domainPrice });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch domain price", error: error.message });
  }
};

// GET DOMAIN PRICE BY TLD
export const getDomainPriceByTLD = async (req, res) => {
  try {
    const normalizedTLD = normalizeTLD(req.params.tld);
    const domainPrice = await prisma.domainPrice.findUnique({ where: { tld: normalizedTLD } });
    if (!domainPrice) return res.status(404).json({ success: false, message: `${normalizedTLD} not found` });
    return res.status(200).json({ success: true, data: domainPrice });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch domain price", error: error.message });
  }
};

// UPDATE DOMAIN PRICE
export const updateDomainPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { tld, price, isActive } = req.body;

    const updateData = {};
    if (tld !== undefined) updateData.tld = normalizeTLD(tld);
    if (price !== undefined) {
      if (price === null || price === "" || Number(price) < 0) {
        return res.status(400).json({ success: false, message: "Invalid price" });
      }
      updateData.price = Number(price);
    }
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updatedDomainPrice = await prisma.domainPrice.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return res.status(200).json({ success: true, message: "Domain price updated successfully", data: updatedDomainPrice });
  } catch (error) {
    if (error.code === 'P2002') return res.status(409).json({ success: false, message: "TLD already exists" });
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: "Domain price not found" });
    return res.status(500).json({ success: false, message: "Failed to update domain price", error: error.message });
  }
};

// DELETE DOMAIN PRICE
export const deleteDomainPrice = async (req, res) => {
  try {
    await prisma.domainPrice.delete({ where: { id: parseInt(req.params.id) } });
    return res.status(200).json({ success: true, message: "Domain price deleted successfully" });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: "Domain price not found" });
    return res.status(500).json({ success: false, message: "Failed to delete domain price", error: error.message });
  }
};

// TOGGLE STATUS
export const toggleDomainPriceStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const domainPrice = await prisma.domainPrice.findUnique({ where: { id } });
    if (!domainPrice) return res.status(404).json({ success: false, message: "Domain price not found" });

    const updated = await prisma.domainPrice.update({
      where: { id },
      data: { isActive: !domainPrice.isActive },
    });

    return res.status(200).json({
      success: true,
      message: `Domain price ${updated.isActive ? "activated" : "deactivated"} successfully`,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to toggle status", error: error.message });
  }
};
