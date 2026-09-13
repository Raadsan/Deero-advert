import express from "express";
import { 
  createDiscount, 
  getPublicDiscounts,
  getAllDiscounts, 
  getDiscountByTarget,
  getUserDiscounts, 
  updateDiscount, 
  updateDiscountStatus, 
  deleteDiscount 
} from "../controllers/discountController.js";

const router = express.Router();

// Public — "All Users" discounts (no auth)
router.get("/public", getPublicDiscounts);

// Get discount for specific item target
router.get("/target", getDiscountByTarget);

router.post("/", createDiscount);
router.get("/", getAllDiscounts);
router.get("/user/:userId", getUserDiscounts);
router.put("/:id", updateDiscount);
router.delete("/:id", deleteDiscount);

export default router;
