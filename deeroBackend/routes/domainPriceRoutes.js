import express from "express";
import {
  createDomainPrice,
  getAllDomainPrices,
  getDomainPriceById,
  getDomainPriceByTLD,
  updateDomainPrice,
  deleteDomainPrice,
  toggleDomainPriceStatus
} from "../controllers/domainPriceController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllDomainPrices);
router.get("/:id", getDomainPriceById);
router.get("/tld/:tld", getDomainPriceByTLD);

router.post("/", protect, createDomainPrice);
router.patch("/:id", protect, updateDomainPrice);
router.delete("/:id", protect, deleteDomainPrice);
router.patch("/:id/toggle", protect, toggleDomainPriceStatus);

export default router;
