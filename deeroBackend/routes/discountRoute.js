import express from "express";
import { 
  createDiscount, 
  getPublicDiscounts,
  getAllDiscounts, 
  getUserDiscounts, 
  updateDiscountStatus, 
  deleteDiscount 
} from "../controllers/discountController.js";

const router = express.Router();

// Public — "All Users" discounts (no auth)
router.get("/public", getPublicDiscounts);

router.post("/", createDiscount);
router.get("/", getAllDiscounts);
router.get("/user/:userId", getUserDiscounts);
router.put("/:id", updateDiscountStatus);
router.delete("/:id", deleteDiscount);

export default router;
