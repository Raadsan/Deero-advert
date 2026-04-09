import { prisma } from "../lib/prisma.js";

// Add Achievement
export const addAchievement = async (req, res) => {
  try {
    const { title, count } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required", success: false });
    if (count === undefined || count === null || count === "") return res.status(400).json({ message: "Count is required", success: false });

    let countNumber = Number(count);
    if (isNaN(countNumber) || !isFinite(countNumber)) {
      return res.status(400).json({ message: `Count must be a valid number. Received: "${count}"`, success: false });
    }

    if (!req.file) return res.status(400).json({ message: "Icon image is required", success: false });

    const achievement = await prisma.achievement.create({
      data: {
        title: title.trim(),
        count: countNumber,
        icon: req.file.path.replace(/\\/g, "/"),
      },
    });

    res.status(201).json({ message: "Achievement created successfully", success: true, data: achievement });
  } catch (error) {
    res.status(500).json({ message: "Failed to add achievement", success: false, error: error.message });
  }
};

// Get All Achievements
export const getAchievements = async (req, res) => {
  try {
    const data = await prisma.achievement.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({
      message: data.length === 0 ? "No achievements found" : "All Achievements",
      success: true,
      data: data,
      count: data.length
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch achievements", success: false, error: error.message });
  }
};

// Get Achievement By ID
export const getAchievementById = async (req, res) => {
  try {
    const achievement = await prisma.achievement.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!achievement) return res.status(404).json({ success: false, message: "Achievement not found" });
    res.status(200).json({ success: true, message: "Achievement retrieved successfully", data: achievement });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Achievement
export const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, count } = req.body;

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (count !== undefined && count !== null && count !== "") {
      let countNumber = Number(count);
      if (isNaN(countNumber) || !isFinite(countNumber)) {
        return res.status(400).json({ message: `Count must be a valid number.`, success: false });
      }
      data.count = countNumber;
    }

    if (req.file) data.icon = req.file.path.replace(/\\/g, "/");

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, message: "No updatable fields provided" });
    }

    const updatedAchievement = await prisma.achievement.update({
      where: { id: parseInt(id) },
      data: data,
    });

    res.status(200).json({ success: true, message: "Achievement updated successfully", data: updatedAchievement });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Achievement
export const deleteAchievement = async (req, res) => {
  try {
    await prisma.achievement.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ message: "Achievement deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", success: false, error: error.message });
  }
};
