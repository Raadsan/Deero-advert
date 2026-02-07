import express from "express";
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage
} from "../controllers/hostingPackageController.js";

const router = express.Router();

// Create a new hosting package
router.post("/", createPackage);

// Get all packages
router.get("/", getAllPackages);

// Get a package by ID
router.get("/:id", getPackageById);

// Update a package by ID
router.patch("/:id", updatePackage);

// Delete a package by ID
router.delete("/:id", deletePackage);

export default router;
