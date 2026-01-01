import express from "express";
import { createClient, getClients, deleteClient } from "../controllers/majorclientController.js";
import upload from "../utils/multer.js";

const router = express.Router();

// GET all clients
router.get("/", getClients);

// POST client with multiple images (max 5)
router.post("/", upload.array("images", 5), createClient);

// DELETE client
router.delete("/:id", deleteClient);

export default router;
