// routes/subscriberRoutes.js
import express from "express";
import {
  subscribe,
  getAllSubscribers,
  getSubscriberById,
  updateSubscriber,
  deleteSubscriber,
} from "../controllers/subscriberController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", subscribe);          // ➕ subscribe
router.get("/", protect, getAllSubscribers);   // 📄 get all
router.get("/:id", protect, getSubscriberById);// 📄 get one
router.patch("/:id", protect, updateSubscriber);// ✏️ update
router.delete("/:id", protect, deleteSubscriber);// 🗑 delete

export default router;
