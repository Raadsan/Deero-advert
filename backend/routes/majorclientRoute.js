import express from "express";
import { createClient, getClients, deleteClient, updateClient } from "../controllers/majorclientController.js";
import upload from "../utils/multer.js";

import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// GET all clients
router.get("/", protect, getClients);

// POST client with a single image
router.post("/", protect, upload.single("image"), createClient);

// DELETE client
router.delete("/:id", protect, deleteClient);

// UPDATE client
router.put("/:id", upload.single("image"), updateClient);

export default router;
