import express from "express";
import {
  addTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial
} from "../controllers/testimonialController.js";
import upload from "../utils/multer.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getTestimonials);

router.post("/", protect, upload.single('clientImage'), addTestimonial);
router.patch("/:id", protect, upload.single('clientImage'), updateTestimonial);
router.delete("/:id", protect, deleteTestimonial);

export default router;
