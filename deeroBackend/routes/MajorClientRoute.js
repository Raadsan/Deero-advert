import express from "express";
import {
    createClient,
    getClients,
    deleteClient,
    updateClient
} from "../controllers/MajorClientController.js";
import upload from "../utils/multer.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getClients);
router.post("/", protect, authorizeMenuAccess("major clients", "majorclient", "clients"), upload.array('images'), createClient);
router.patch("/:id", protect, authorizeMenuAccess("major clients", "majorclient", "clients"), upload.array('images'), updateClient);
router.put("/:id", protect, authorizeMenuAccess("major clients", "majorclient", "clients"), upload.array('images'), updateClient);
router.delete("/:id", protect, authorizeMenuAccess("major clients", "majorclient", "clients"), deleteClient);

export default router;
