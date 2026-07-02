import express from "express";
import {
  addBlog,
  getBlogs,
  getBlogByIdOrSlug,
  updateBlog,
  deleteBlog
} from "../controllers/blogsController.js";
import upload from "../utils/multer.js";
import { authorizeMenuAccess, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeMenuAccess("blogs"), upload.any(), addBlog);
router.get("/", getBlogs);
router.get("/:idOrSlug", getBlogByIdOrSlug);
router.patch("/:id", protect, authorizeMenuAccess("blogs"), upload.any(), updateBlog);
router.delete("/:id", protect, authorizeMenuAccess("blogs"), deleteBlog);

export default router;
