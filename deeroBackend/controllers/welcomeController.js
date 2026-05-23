import { prisma } from "../lib/prisma.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

// ─── CREATE ───────────────────────────────────────────────────────────────────
export const createWelcomeMessage = async (req, res) => {
  try {
    const { title, subtitle, content, presidentName, presidentTitle, facebook, linkedin, instagram, isActive } = req.body;
    const image = getFilePath(req, ["image"]);

    const welcomeMessage = await prisma.welcomeMessage.create({
      data: {
        title: title || "WELCOME TO THE HOME OF CREATIVE EXCELLENCE.",
        subtitle: subtitle || "Deero Advert President",
        content: content || "",
        presidentName: presidentName || "Eng. Ayuub Mohamud",
        presidentTitle: presidentTitle || "President",
        facebook: facebook || null,
        linkedin: linkedin || null,
        instagram: instagram || null,
        image: image || null,
        isActive: isActive === "false" ? false : true,
      },
    });

    res.status(201).json({ success: true, data: welcomeMessage, message: "Created successfully" });
  } catch (error) {
    console.error("Error creating welcome message:", error);
    res.status(500).json({ success: false, message: "Failed to create welcome message", error: error.message });
  }
};

// ─── GET ALL ─────────────────────────────────────────────────────────────────
export const getWelcomeMessages = async (req, res) => {
  try {
    const messages = await prisma.welcomeMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching welcome messages:", error);
    res.status(500).json({ success: false, message: "Failed to fetch welcome messages", error: error.message });
  }
};

// ─── GET ACTIVE (single) ──────────────────────────────────────────────────────
export const getActiveWelcomeMessage = async (req, res) => {
  try {
    const welcomeMessage = await prisma.welcomeMessage.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: welcomeMessage });
  } catch (error) {
    console.error("Error fetching active welcome message:", error);
    res.status(500).json({ success: false, message: "Failed to fetch welcome message", error: error.message });
  }
};

// ─── GET BY ID ────────────────────────────────────────────────────────────────
export const getWelcomeMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const welcomeMessage = await prisma.welcomeMessage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!welcomeMessage) {
      return res.status(404).json({ success: false, message: "Welcome message not found" });
    }

    res.status(200).json({ success: true, data: welcomeMessage });
  } catch (error) {
    console.error("Error fetching welcome message:", error);
    res.status(500).json({ success: false, message: "Failed to fetch welcome message", error: error.message });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
export const updateWelcomeMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, content, presidentName, presidentTitle, facebook, linkedin, instagram, isActive } = req.body;
    const image = getFilePath(req, ["image"]);

    const existing = await prisma.welcomeMessage.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Welcome message not found" });
    }

    const update = {};
    if (title !== undefined) update.title = title;
    if (subtitle !== undefined) update.subtitle = subtitle;
    if (content !== undefined) update.content = content;
    if (presidentName !== undefined) update.presidentName = presidentName;
    if (presidentTitle !== undefined) update.presidentTitle = presidentTitle;
    if (facebook !== undefined) update.facebook = facebook;
    if (linkedin !== undefined) update.linkedin = linkedin;
    if (instagram !== undefined) update.instagram = instagram;
    if (image) update.image = image;
    if (isActive !== undefined) update.isActive = isActive === "true" || isActive === true;

    const welcomeMessage = await prisma.welcomeMessage.update({
      where: { id: parseInt(id) },
      data: update,
    });

    res.status(200).json({ success: true, data: welcomeMessage, message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating welcome message:", error);
    res.status(500).json({ success: false, message: "Failed to update welcome message", error: error.message });
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
export const deleteWelcomeMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.welcomeMessage.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting welcome message:", error);
    res.status(500).json({ success: false, message: "Failed to delete welcome message", error: error.message });
  }
};
