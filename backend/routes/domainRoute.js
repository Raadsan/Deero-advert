// routes/domainRoutes.js
import express from "express";
import { registerDomain, transferDomain, renewDomain, getAllDomains } from "../controllers/domainController.js";

const router = express.Router();

// Register
router.post("/register", registerDomain);

// Transfer
router.post("/transfer", transferDomain);

// Renew
router.post("/renew", renewDomain);

// Get All Domains
router.get("/", getAllDomains);

export default router;
