import { prisma } from "../lib/prisma.js";

export const createPackage = async (req, res) => {
  try {
    const { name, price, desc, pudgeText, features } = req.body;
    
    if (!name) return res.status(400).json({ success: false, message: "name field is required" });
    if (price === undefined || price === null) return res.status(400).json({ success: false, message: "price field is required" });

    const pkg = await prisma.hostingPackage.create({
      data: {
        name,
        price: Number(price),
        desc,
        pudgeText,
        features: features || [], // Json field
      },
    });

    res.status(201).json({ success: true, data: pkg });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllPackages = async (req, res) => {
  try {
    const packages = await prisma.hostingPackage.findMany();
    res.status(200).json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPackageById = async (req, res) => {
  try {
    const pkg = await prisma.hostingPackage.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!pkg) return res.status(404).json({ success: false, message: "Package not found" });
    res.status(200).json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.price !== undefined) data.price = Number(data.price);

    const pkg = await prisma.hostingPackage.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
    res.status(200).json({ success: true, data: pkg });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePackage = async (req, res) => {
  try {
    await prisma.hostingPackage.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
