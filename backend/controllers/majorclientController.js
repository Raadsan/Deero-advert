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

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }

    const imageFilenames = req.files.map(file => file.filename);

    const client = new Client({
      description,
      images: imageFilenames
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
