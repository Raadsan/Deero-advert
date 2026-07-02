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
router.get("/", protect, authorizeMenuAccess("contacts", "contact"), getContacts);
router.get("/:id", protect, authorizeMenuAccess("contacts", "contact"), getContactById);
router.delete("/:id", protect, authorizeMenuAccess("contacts", "contact"), deleteContact);

export default router;
