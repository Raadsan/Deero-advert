import { prisma } from "../lib/prisma.js";
import fs from "fs/promises";

// CREATE a new client
export const createClient = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) return res.status(400).json({ success: false, message: "Description is required" });
    if (!req.file) return res.status(400).json({ success: false, message: "An image is required" });

    const imagePath = req.file.path.replace(/\\/g, "/");

    const client = await prisma.majorClient.create({
      data: {
        description,
        images: {
          create: [{ imagePath }]
        }
      },
      include: { images: true }
    });

    res.status(201).json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all clients
export const getClients = async (req, res) => {
  try {
    const clients = await prisma.majorClient.findMany({
      include: { images: true }
    });
    res.json({ success: true, clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE client
export const deleteClient = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const client = await prisma.majorClient.findUnique({ 
      where: { id },
      include: { images: true }
    });
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });

    // Delete all images from filesystem if not cloudinary
    for (const img of client.images) {
      if (img.imagePath && !img.imagePath.startsWith("http")) {
        try {
          await fs.unlink(img.imagePath);
        } catch (err) {
          console.log(`File ${img.imagePath} not found, skipping.`);
        }
      }
    }

    // Cascade delete should be handled by Prisma if configured, but let's do manually just in case
    await prisma.majorClientImage.deleteMany({ where: { majorClientId: id } });
    await prisma.majorClient.delete({ where: { id } });
    
    res.json({ success: true, message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE client
export const updateClient = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { description } = req.body;
    
    const updateData = {};
    if (description) updateData.description = description;

    if (req.file) {
      const imagePath = req.file.path.replace(/\\/g, "/");
      updateData.images = {
        create: [{ imagePath }]
      };
    }

    const client = await prisma.majorClient.update({
      where: { id },
      data: updateData,
      include: { images: true }
    });

    res.json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
