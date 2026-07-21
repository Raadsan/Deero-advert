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

export const createHeroAbout = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;
    const watermarkImage = getFilePath(req, ["watermarkImage"]);

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const heroAbout = await prisma.heroAbout.create({
      data: {
        title,
        description: description || null,
        watermarkImage: watermarkImage || null,
        isActive: isActive === "false" ? false : true,
      },
    });

    res.status(201).json({ success: true, data: heroAbout, message: "Created successfully" });
  } catch (error) {
    console.error("Error creating HeroAbout:", error);
    res.status(500).json({ success: false, message: "Failed to create HeroAbout", error: error.message });
  }
};

export const getHeroAbouts = async (req, res) => {
  try {
    const heros = await prisma.heroAbout.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: heros });
  } catch (error) {
    console.error("Error fetching HeroAbouts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch HeroAbouts", error: error.message });
  }
};

export const getActiveHeroAbout = async (req, res) => {
  try {
    const hero = await prisma.heroAbout.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: hero });
  } catch (error) {
    console.error("Error fetching active HeroAbout:", error);
    res.status(500).json({ success: false, message: "Failed to fetch active HeroAbout", error: error.message });
  }
};

export const getHeroAboutById = async (req, res) => {
  try {
    const { id } = req.params;
    const hero = await prisma.heroAbout.findUnique({
      where: { id: parseInt(id) },
    });

    if (!hero) {
      return res.status(404).json({ success: false, message: "HeroAbout not found" });
    }

    res.status(200).json({ success: true, data: hero });
  } catch (error) {
    console.error("Error fetching HeroAbout:", error);
    res.status(500).json({ success: false, message: "Failed to fetch HeroAbout", error: error.message });
  }
};

export const updateHeroAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isActive } = req.body;
    const watermarkImage = getFilePath(req, ["watermarkImage"]);

    const existing = await prisma.heroAbout.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "HeroAbout not found" });
    }

    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (watermarkImage) update.watermarkImage = watermarkImage;
    if (isActive !== undefined) update.isActive = isActive === "true" || isActive === true;

    const hero = await prisma.heroAbout.update({
      where: { id: parseInt(id) },
      data: update,
    });

    res.status(200).json({ success: true, data: hero, message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating HeroAbout:", error);
    res.status(500).json({ success: false, message: "Failed to update HeroAbout", error: error.message });
  }
};

export const deleteHeroAbout = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.heroAbout.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting HeroAbout:", error);
    res.status(500).json({ success: false, message: "Failed to delete HeroAbout", error: error.message });
  }
};
