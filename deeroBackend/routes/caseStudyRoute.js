import express from "express";
import {
  addCaseStudy,
  getCaseStudies,
  getCaseStudyById,
  updateCaseStudy,
  deleteCaseStudy
} from "../controllers/caseStudyController.js";
import upload from "../utils/multer.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.any(), addCaseStudy);
router.get("/", getCaseStudies);
router.get("/:id", getCaseStudyById);
router.patch("/:id", protect, upload.any(), updateCaseStudy);
router.delete("/:id", protect, deleteCaseStudy);

export default router;
