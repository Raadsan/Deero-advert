import express from "express";
import { 
  createDiscount, 
  getAllDiscounts, 
  getUserDiscounts, 
  updateDiscountStatus, 
  deleteDiscount 
} from "../controllers/discountController.js";

const router = express.Router();

router.post("/", createDiscount);
router.get("/", getAllDiscounts);
router.get("/user/:userId", getUserDiscounts);
router.put("/:id", updateDiscountStatus);
router.delete("/:id", deleteDiscount);

export default router;
