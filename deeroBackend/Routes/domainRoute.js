import express from "express";
import { checkDomainAvailability } from "../controllers/domainController.js";

const router = express.Router();

router.get("/check", checkDomainAvailability);

export default router;
