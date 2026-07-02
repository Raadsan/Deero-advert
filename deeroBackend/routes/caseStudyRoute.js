import express from "express";
import {
  addCaseStudy,
  getCaseStudies,
  getCaseStudyById,
  updateCaseStudy,
  deleteCaseStudy
} from "../controllers/caseStudyController.js";
import upload from "../utils/multer.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeMenuAccess("case studies", "casestudy"), upload.any(), addCaseStudy);
router.get("/", getCaseStudies);
router.get("/:id", getCaseStudyById);
router.patch("/:id", protect, authorizeMenuAccess("case studies", "casestudy"), upload.any(), updateCaseStudy);
router.delete("/:id", protect, authorizeMenuAccess("case studies", "casestudy"), deleteCaseStudy);

export default router;
