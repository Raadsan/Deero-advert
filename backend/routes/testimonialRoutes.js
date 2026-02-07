import express from "express";
import upload from "../utils/multer.js"; // ✅ your existing multer
import {
  addTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial
} from "../controllers/testimonialController.js";

const router = express.Router();

// POST - add testimonial (client image upload)
router.post("/", upload.single("clientImage"), addTestimonial);

// GET - all testimonials
router.get("/", getTestimonials);

// PATCH/PUT - update testimonial (client image upload is optional)
router.patch("/:id", upload.single("clientImage"), updateTestimonial);


// DELETE - testimonial
router.delete("/:id", deleteTestimonial);

export default router;
