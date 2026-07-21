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

export const createAward = async (req, res) => {
  try {
    const { title, sortOrder, isActive } = req.body;
    const image = getFilePath(req, ["image"]);
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });
    const item = await prisma.award.create({
      data: { title, image, sortOrder: sortOrder ? parseInt(sortOrder) : 0, isActive: isActive === "false" ? false : true },
    });
    res.status(201).json({ success: true, data: item, message: "Created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAwards = async (req, res) => {
  try {
    const items = await prisma.award.findMany({ orderBy: { sortOrder: "asc" } });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveAwards = async (req, res) => {
  try {
    const items = await prisma.award.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAwardById = async (req, res) => {
  try {
    const item = await prisma.award.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, sortOrder, isActive } = req.body;
    const image = getFilePath(req, ["image"]);
    const existing = await prisma.award.findUnique({ where: { id: parseInt(id) } });
    if (!existing) return res.status(404).json({ success: false, message: "Not found" });
    const update = {};
    if (title !== undefined) update.title = title;
    if (image) update.image = image;
    if (isActive !== undefined) update.isActive = isActive === "true" || isActive === true;
    if (sortOrder !== undefined) update.sortOrder = parseInt(sortOrder);
    const item = await prisma.award.update({ where: { id: parseInt(id) }, data: update });
    res.status(200).json({ success: true, data: item, message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAward = async (req, res) => {
  try {
    await prisma.award.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
