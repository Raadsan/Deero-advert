import express from "express";
import {
  createPortfolio,
  getAllPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  deleteGalleryImage
} from "../controllers/portfolioController.js";
import upload from "../utils/multer.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "gallery", maxCount: 200 },
]);

router.get("/", getAllPortfolios);
router.get("/:id", getPortfolioById);
router.post("/", protect, uploadFields, createPortfolio);
router.patch("/:id", protect, upload.any(), updatePortfolio);
router.delete("/:id", protect, deletePortfolio);
router.post("/:id/delete-gallery-image", protect, deleteGalleryImage);

export default router;
