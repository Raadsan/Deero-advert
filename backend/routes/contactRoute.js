import express from "express";
import { createContact, getContacts, getContactById, deleteContact } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", getContacts);
router.get("/:id", getContactById);
router.delete("/:id", deleteContact);

export default router;
