import express from "express";
import { createContact, getContacts, getContactById, deleteContact } from "../controllers/contactController.js";

import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", createContact);
router.get("/", protect, getContacts);
router.get("/:id", protect, getContactById);
router.delete("/:id", protect, deleteContact);

export default router;
