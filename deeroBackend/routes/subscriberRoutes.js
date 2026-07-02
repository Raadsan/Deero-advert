import express from "express";
import {
    subscribe,
    getAllSubscribers,
    getSubscriberById,
    updateSubscriber,
    deleteSubscriber
} from "../controllers/subscriberController.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", subscribe);

router.get("/", protect, authorizeMenuAccess("subscribers", "subscriber"), getAllSubscribers);
router.get("/:id", protect, authorizeMenuAccess("subscribers", "subscriber"), getSubscriberById);
router.patch("/:id", protect, authorizeMenuAccess("subscribers", "subscriber"), updateSubscriber);
router.delete("/:id", protect, authorizeMenuAccess("subscribers", "subscriber"), deleteSubscriber);

export default router;
