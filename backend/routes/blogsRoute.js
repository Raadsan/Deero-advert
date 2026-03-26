import express from "express";
import {
  addBlog,
  getBlogs,
  getBlogByIdOrSlug,
  updateBlog,
  deleteBlog
} from "../controllers/blogsController.js";
import upload from "../utils/multer.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();


// Add new blog (accept file uploads)
router.post("/", protect, upload.any(), addBlog);

// Get all blogs
router.get("/", protect, getBlogs);

// Get single blog by ID or slug
router.get("/:idOrSlug", protect, getBlogByIdOrSlug);

// Update blog by ID
// Update blog by ID (accept file uploads on update)
router.patch("/:id", protect, upload.any(), updateBlog);

// Delete blog by ID
router.delete("/:id", protect, deleteBlog);

export default router;
