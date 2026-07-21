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

export const createHeroHome = async (req, res) => {
  try {
    const { title, description, isActive, sortOrder } = req.body;
    const image = getFilePath(req, ["image"]);

    if (!title || !description || !image) {
      return res.status(400).json({ success: false, message: "Title, description and image are required" });
    }

    const heroHome = await prisma.heroHome.create({
      data: {
        title,
        description,
        image,
        isActive: isActive === "false" ? false : true,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });

    res.status(201).json({ success: true, data: heroHome, message: "Created successfully" });
  } catch (error) {
    console.error("Error creating HeroHome:", error);
    res.status(500).json({ success: false, message: "Failed to create HeroHome", error: error.message });
  }
};

export const getHeroHomes = async (req, res) => {
  try {
    const heros = await prisma.heroHome.findMany({
      orderBy: { sortOrder: "asc" },
    });
    res.status(200).json({ success: true, data: heros });
  } catch (error) {
    console.error("Error fetching HeroHomes:", error);
    res.status(500).json({ success: false, message: "Failed to fetch HeroHomes", error: error.message });
  }
};

export const getActiveHeroHomes = async (req, res) => {
  try {
    const heros = await prisma.heroHome.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    res.status(200).json({ success: true, data: heros });
  } catch (error) {
    console.error("Error fetching active HeroHomes:", error);
    res.status(500).json({ success: false, message: "Failed to fetch HeroHomes", error: error.message });
  }
};

export const getHeroHomeById = async (req, res) => {
  try {
    const { id } = req.params;
    const heroHome = await prisma.heroHome.findUnique({
      where: { id: parseInt(id) },
    });

    if (!heroHome) {
      return res.status(404).json({ success: false, message: "HeroHome not found" });
    }

    res.status(200).json({ success: true, data: heroHome });
  } catch (error) {
    console.error("Error fetching HeroHome:", error);
    res.status(500).json({ success: false, message: "Failed to fetch HeroHome", error: error.message });
  }
};

export const updateHeroHome = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isActive, sortOrder } = req.body;
    const image = getFilePath(req, ["image"]);

    const existing = await prisma.heroHome.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "HeroHome not found" });
    }

    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (image) update.image = image;
    if (isActive !== undefined) update.isActive = isActive === "true" || isActive === true;
    if (sortOrder !== undefined) update.sortOrder = parseInt(sortOrder);

    const heroHome = await prisma.heroHome.update({
      where: { id: parseInt(id) },
      data: update,
    });

    res.status(200).json({ success: true, data: heroHome, message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating HeroHome:", error);
    res.status(500).json({ success: false, message: "Failed to update HeroHome", error: error.message });
  }
};

export const deleteHeroHome = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.heroHome.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting HeroHome:", error);
    res.status(500).json({ success: false, message: "Failed to delete HeroHome", error: error.message });
  }
};
