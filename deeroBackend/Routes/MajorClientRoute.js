import express from "express";
import {
    createClient,
    getClients,
    deleteClient,
    updateClient
} from "../controllers/MajorClientController.js";
import upload from "../utils/multer.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getClients);
router.post("/", protect, upload.array('images'), createClient);
router.patch("/:id", protect, upload.array('images'), updateClient);
router.put("/:id", protect, upload.array('images'), updateClient);
router.delete("/:id", protect, deleteClient);

export default router;
