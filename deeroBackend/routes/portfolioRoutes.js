import express from "express";
import {
  createPortfolio,
  getAllPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  deleteGalleryImage,
  reorderGalleryImages
} from "../controllers/portfolioController.js";
import upload from "../utils/multer.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "gallery", maxCount: 200 },
]);

router.get("/", getAllPortfolios);
router.get("/:id", getPortfolioById);
router.post("/", protect, authorizeMenuAccess("portfolio", "portfolios"), uploadFields, createPortfolio);
router.patch("/:id", protect, authorizeMenuAccess("portfolio", "portfolios"), uploadFields, updatePortfolio);
router.delete("/:id", protect, authorizeMenuAccess("portfolio", "portfolios"), deletePortfolio);
router.post("/:id/delete-gallery-image", protect, authorizeMenuAccess("portfolio", "portfolios"), deleteGalleryImage);
router.post("/:id/reorder-gallery", protect, authorizeMenuAccess("portfolio", "portfolios"), reorderGalleryImages);

export default router;
