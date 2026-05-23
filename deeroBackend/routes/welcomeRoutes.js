import express from "express";
import {
  createWelcomeMessage,
  getWelcomeMessages,
  getActiveWelcomeMessage,
  getWelcomeMessageById,
  updateWelcomeMessage,
  deleteWelcomeMessage,
} from "../controllers/welcomeController.js";
import upload from "../utils/multer.js";

const router = express.Router();

const uploader = upload.fields([{ name: "image", maxCount: 1 }]);

// GET all
router.get("/", getWelcomeMessages);

// GET active (single, for public page)
router.get("/active", getActiveWelcomeMessage);

// GET by ID
router.get("/:id", getWelcomeMessageById);

// CREATE
router.post("/", uploader, createWelcomeMessage);

// UPDATE
router.put("/:id", uploader, updateWelcomeMessage);

// DELETE
router.delete("/:id", deleteWelcomeMessage);

export default router;
