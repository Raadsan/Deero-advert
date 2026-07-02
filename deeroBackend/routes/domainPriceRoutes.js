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
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllDomainPrices);
router.get("/:id", getDomainPriceById);
router.get("/tld/:tld", getDomainPriceByTLD);

router.post("/", protect, authorizeMenuAccess("domain prices", "domains", "domain"), createDomainPrice);
router.patch("/:id", protect, authorizeMenuAccess("domain prices", "domains", "domain"), updateDomainPrice);
router.delete("/:id", protect, authorizeMenuAccess("domain prices", "domains", "domain"), deleteDomainPrice);
router.patch("/:id/toggle", protect, authorizeMenuAccess("domain prices", "domains", "domain"), toggleDomainPriceStatus);

export default router;
