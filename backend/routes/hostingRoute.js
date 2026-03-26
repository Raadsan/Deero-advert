import express from "express";
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage
} from "../controllers/hostingPackageController.js";

import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Create a new hosting package
router.post("/", protect, createPackage);

// Get all packages
router.get("/", protect, getAllPackages);

// Get a package by ID
router.get("/:id", protect, getPackageById);

// Update a package by ID
router.patch("/:id", protect, updatePackage);

// Delete a package by ID
router.delete("/:id", protect, deletePackage);

export default router;
