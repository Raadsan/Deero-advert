import express from "express";
import upload from "../utils/multer.js"; // ✅ your existing multer
import {
  addTestimonial,
  getTestimonials,
  deleteTestimonial
} from "../controllers/testimonialController.js";

const router = express.Router();

// POST - add testimonial (client image upload)
router.post("/", upload.single("clientImage"), addTestimonial);

// GET - all testimonials
router.get("/", getTestimonials);

// DELETE - testimonial
router.delete("/:id", deleteTestimonial);

export default router;
