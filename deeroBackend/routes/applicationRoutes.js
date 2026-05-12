import express from "express";
import { 
    submitApplication, 
    getAllApplications, 
    updateApplicationStatus, 
    deleteApplication 
} from "../controllers/ApplicationController.js";

import upload from "../utils/multer.js";
const router = express.Router();

router.post("/", upload.any(), submitApplication);
router.get("/", getAllApplications);
router.patch("/:id/status", updateApplicationStatus);
router.delete("/:id", deleteApplication);

export default router;
