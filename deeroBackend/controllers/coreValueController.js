import { prisma } from "../lib/prisma.js";

const getFilePath = (req, names) => {
  if (!req.files) return undefined;
  if (Array.isArray(req.files)) {
    const f = req.files.find((file) => names.includes(file.fieldname));
    return f ? f.path.replace(/\\/g, "/") : undefined;
  }
  for (const n of names) {
    if (req.files[n]?.[0]) return req.files[n][0].path.replace(/\\/g, "/");
  }
  return undefined;
};

export const createCoreValue = async (req, res) => {
  try {
    const { title, sortOrder, isActive } = req.body;
    const icon = getFilePath(req, ["icon"]);
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });
    const item = await prisma.coreValue.create({
      data: { title, icon, sortOrder: sortOrder ? parseInt(sortOrder) : 0, isActive: isActive === "false" ? false : true },
    });
    res.status(201).json({ success: true, data: item, message: "Created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCoreValues = async (req, res) => {
  try {
    const items = await prisma.coreValue.findMany({ orderBy: { sortOrder: "asc" } });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveCoreValues = async (req, res) => {
  try {
    const items = await prisma.coreValue.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCoreValueById = async (req, res) => {
  try {
    const item = await prisma.coreValue.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCoreValue = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, sortOrder, isActive } = req.body;
    const icon = getFilePath(req, ["icon"]);
    const existing = await prisma.coreValue.findUnique({ where: { id: parseInt(id) } });
    if (!existing) return res.status(404).json({ success: false, message: "Not found" });
    const update = {};
    if (title !== undefined) update.title = title;
    if (icon) update.icon = icon;
    if (isActive !== undefined) update.isActive = isActive === "true" || isActive === true;
    if (sortOrder !== undefined) update.sortOrder = parseInt(sortOrder);
    const item = await prisma.coreValue.update({ where: { id: parseInt(id) }, data: update });
    res.status(200).json({ success: true, data: item, message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCoreValue = async (req, res) => {
  try {
    await prisma.coreValue.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
