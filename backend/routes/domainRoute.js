import express from "express";
import { checkDomainAvailability } from "../controllers/domainController.js";

const router = express.Router();

// GET /api/domain/check?domain=...
router.get("/check", checkDomainAvailability);

export default router;
