import { prisma } from "../lib/prisma.js";
import fs from "fs/promises";

// CREATE a new client
export const createClient = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) return res.status(400).json({ success: false, message: "Description is required" });
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: "At least one image is required" });

    const imagePaths = req.files.map(file => file.path.replace(/\\/g, "/"));

    const client = await prisma.majorClient.create({
      data: {
        description,
        images: {
          create: imagePaths.map(path => ({ imagePath: path }))
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
    let { description, existingImages } = req.body;

    // existingImages might be a string (if one) or undefined (if none)
    if (typeof existingImages === 'string') {
        existingImages = [existingImages];
    } else if (!existingImages) {
        existingImages = [];
    }

    const updateData = {};
    if (description) updateData.description = description;

    // 1. Handle deletion of images not in existingImages
    // Fetch current images first
    const currentClient = await prisma.majorClient.findUnique({
        where: { id },
        include: { images: true }
    });

    if (!currentClient) return res.status(404).json({ success: false, message: "Client not found" });

    // Delete images that are not in existingImages
    for (const currentImg of currentClient.images) {
        // We need to compare currentImg.imagePath with existingImages
        // existingImages from frontend are full URLs or relative paths depending on getImageUrl
        // Let's check how getImageUrl is implemented to be sure
        const isStillThere = existingImages.some(ei => ei.includes(currentImg.imagePath));
        
        if (!isStillThere) {
            // Delete from database
            await prisma.majorClientImage.delete({ where: { id: currentImg.id } });
            
            // Optional: Delete from filesystem/Cloudinary if not needed
            // If it's Cloudinary, we might need public_id, but here let's just keep it simple or use fs.unlink if local
             if (currentImg.imagePath && !currentImg.imagePath.startsWith("http")) {
                try {
                    await fs.unlink(currentImg.imagePath);
                } catch (err) {
                    console.log(`File ${currentImg.imagePath} not found during cleanup.`);
                }
            }
        }
    }

    // 2. Add new images
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => file.path.replace(/\\/g, "/"));
      updateData.images = {
        create: imagePaths.map(path => ({ imagePath: path }))
      };
    }

    const client = await prisma.majorClient.update({
      where: { id },
      data: updateData,
      include: { images: true }
    });

    res.json({ success: true, client });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
