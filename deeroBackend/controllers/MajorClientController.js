import { prisma } from "../lib/prisma.js";
import fs from "fs/promises";
import { deleteS3Object, isS3Url } from "../utils/s3.js";

const deleteStoredImage = async (imagePath) => {
  if (!imagePath) return;

  if (isS3Url(imagePath)) {
    try {
      await deleteS3Object(imagePath);
    } catch (err) {
      console.log(`S3 object ${imagePath} not found, skipping.`, err.message);
    }
    return;
  }

  try {
    await fs.unlink(imagePath);
  } catch (err) {
    console.log(`File ${imagePath} not found, skipping.`);
  }
};

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

    for (const img of client.images) {
      await deleteStoredImage(img.imagePath);
    }

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

    if (typeof existingImages === 'string') {
        existingImages = [existingImages];
    } else if (!existingImages) {
        existingImages = [];
    }

    const updateData = {};
    if (description) updateData.description = description;

    const currentClient = await prisma.majorClient.findUnique({
        where: { id },
        include: { images: true }
    });

    if (!currentClient) return res.status(404).json({ success: false, message: "Client not found" });

    for (const currentImg of currentClient.images) {
        const isStillThere = existingImages.some(ei => ei.includes(currentImg.imagePath));
        
        if (!isStillThere) {
            await prisma.majorClientImage.delete({ where: { id: currentImg.id } });
            await deleteStoredImage(currentImg.imagePath);
        }
    }

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
