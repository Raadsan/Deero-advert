import express from "express";
import {
  addBlog,
  getBlogs,
  getBlogByIdOrSlug,
  updateBlog,
  deleteBlog
} from "../controllers/blogsController.js";
import upload from "../utils/multer.js";
const router = express.Router();



// Create a new blog (accepts file uploads)
// Use `upload.any()` to accept different file field names from clients,
// then map aliases in the controller (avatar -> author_avatar, image -> featured_image).
router.post("/", upload.any(), addBlog);

// Get all blogs
router.get("/", getBlogs);

// Get single blog by ID or slug
router.get("/:idOrSlug", getBlogByIdOrSlug);

// Update blog by ID
// Update blog by ID (accept file uploads on partial update)
router.patch("/:id", upload.any(), updateBlog);

// Delete blog by ID
router.delete("/:id", deleteBlog);

export default router;
