import express from "express";
import {
  createPortfolio,
  getAllPortfolios,
  updatePortfolio,
  deletePortfolio,
  deleteGalleryImage,
  getPortfolioById
} from "../controllers/portfolioController.js";
import upload from "../utils/multer.js"; // your Multer config
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Fields for mainImage + gallery
const uploadFields = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "gallery", maxCount: 200 },
]);

// ➕ Create portfolio
router.post("/", protect, uploadFields, createPortfolio);

// 📥 Get all portfolios
router.get("/", protect, getAllPortfolios);
router.get("/:id", protect, getPortfolioById);

// 📝 Update portfolio
router.patch("/:id", protect, upload.any(), updatePortfolio);

// 🗑 Delete portfolio
router.delete("/:id", protect, deletePortfolio);

// 🗑 Delete single gallery image
router.delete("/:id/gallery", protect, deleteGalleryImage);

export default router;
