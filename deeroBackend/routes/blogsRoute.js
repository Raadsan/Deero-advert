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

router.post("/", protect, upload.any(), addBlog);
router.get("/", getBlogs);
router.get("/:idOrSlug", getBlogByIdOrSlug);
router.patch("/:id", protect, upload.any(), updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
