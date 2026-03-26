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
router.get("/", getAllSubscribers);   // 📄 get all
router.get("/:id", getSubscriberById);// 📄 get one
router.patch("/:id", updateSubscriber);// ✏️ update
router.delete("/:id", deleteSubscriber);// 🗑 delete

export default router;
