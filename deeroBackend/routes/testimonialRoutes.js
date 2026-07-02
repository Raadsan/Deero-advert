import express from "express";
import {
  addTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial
} from "../controllers/testimonialController.js";
import upload from "../utils/multer.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getTestimonials);

router.post("/", protect, authorizeMenuAccess("testimonials", "testimonial"), upload.single('clientImage'), addTestimonial);
router.patch("/:id", protect, authorizeMenuAccess("testimonials", "testimonial"), upload.single('clientImage'), updateTestimonial);
router.delete("/:id", protect, authorizeMenuAccess("testimonials", "testimonial"), deleteTestimonial);

export default router;
