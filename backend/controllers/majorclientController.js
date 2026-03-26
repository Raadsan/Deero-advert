import Client from "../models/majorClient.js";
import path from "path";
import fs from "fs/promises";

// CREATE a new client with multiple images
export const createClient = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "An image is required" });
    }

    const imageFilename = req.file.path;

    const client = new Client({
      description,
      images: [imageFilename]
    });

    await client.save();

    res.status(201).json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all clients
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json({ success: true, clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE client
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });

    // Delete all images
    for (const img of client.images) {
      if (img.startsWith("http")) continue; // Skip Cloudinary URLs for local unlink
      const filePath = path.join("uploads", img);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.log(`File ${img} not found, skipping.`);
      }
    }

    await client.deleteOne();
    res.json({ success: true, message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE client
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    
    let existingImages = req.body.existingImages || [];
    if (typeof existingImages === 'string') {
        existingImages = [existingImages];
    }
    
    // Map URL to relative path for existing images
    const cleanExistingImages = existingImages.map(img => {
       try {
         const url = new URL(img);
         const pathname = url.pathname.replace(/^\//, ''); // e.g., 'uploads/image.png'
         // Replace forward slashes with backslashes for windows compat if needed, 
         // but Mongoose stores strings verbatim, so we can just use path.normalize
         return path.normalize(pathname);
       } catch {
         return img;
       }
    });

    const newImageFilename = req.file ? [req.file.path] : [];
    const finalImages = [...cleanExistingImages, ...newImageFilename];

    if (!description) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }
    if (finalImages.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }

    const client = await Client.findByIdAndUpdate(
      id,
      { description, images: finalImages },
      { new: true }
    );

    if (!client) return res.status(404).json({ success: false, message: "Client not found" });

    res.json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
