import express from "express";
import {
    subscribe,
    getAllSubscribers,
    getSubscriberById,
    updateSubscriber,
    deleteSubscriber
} from "../controllers/subscriberController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", subscribe);

router.get("/", protect, getAllSubscribers);
router.get("/:id", protect, getSubscriberById);
router.patch("/:id", protect, updateSubscriber);
router.delete("/:id", protect, deleteSubscriber);

export default router;
