import express from "express";
import {
  createDomainPrice,
  getAllDomainPrices,
  getDomainPriceById,
  getDomainPriceByTLD,
  updateDomainPrice,
  deleteDomainPrice,
  toggleDomainPriceStatus,
} from "../controllers/domainPriceController.js";

const router = express.Router();

router.post("/", createDomainPrice);
router.get("/", getAllDomainPrices);
router.get("/tld/:tld", getDomainPriceByTLD);

router.get("/:id", getDomainPriceById);
router.put("/:id", updateDomainPrice);
router.patch("/:id/toggle-status", toggleDomainPriceStatus);
router.delete("/:id", deleteDomainPrice);

export default router;
