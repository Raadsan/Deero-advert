import express from "express";
import {
    createContact,
    getContacts,
    getContactById,
    deleteContact
} from "../controllers/contactController.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", protect, authorizeMenuAccess("contacts", "contact", "messages", "message", "management"), getContacts);
router.get("/:id", protect, authorizeMenuAccess("contacts", "contact", "messages", "message", "management"), getContactById);
router.delete("/:id", protect, authorizeMenuAccess("contacts", "contact", "messages", "message", "management"), deleteContact);

export default router;
