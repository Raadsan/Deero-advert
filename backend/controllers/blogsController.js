import mongoose from "mongoose";
import Blog from "../models/blogsModel.js";


// Create a new blog
export const addBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      author: authorBody,
      featured_image: featuredImageBody,
      categories: categoriesBody,
      published_date,
      is_published,
      is_featured
    } = req.body;

    // Parse author (allow JSON string or object)
    let author = {};
    if (authorBody) {
      if (typeof authorBody === "string") {
        try {
          author = JSON.parse(authorBody);
        } catch (e) {
          author = { name: authorBody };
        }
      } else {
        author = authorBody;
      }
    }

    // Handle uploaded files (multer puts files on req.files)
    let featured_image = featuredImageBody;
    if (req.files) {
      // Accept multiple possible field names and map aliases to expected fields.
      // Handle both shapes: req.files can be an array (upload.any()) or an object (upload.fields()).
      const getFilePath = (names) => {
        if (!req.files) return undefined;
        if (Array.isArray(req.files)) {
          const f = req.files.find((file) => names.includes(file.fieldname));
          return f ? f.path.replace(/\\/g, "/") : undefined;
        }
        for (const n of names) {
          if (req.files[n] && req.files[n][0]) return req.files[n][0].path.replace(/\\/g, "/");
        }
        return undefined;
      };

      // For featured image accept: featured_image, image, featuredImage
      const fImg = getFilePath(["featured_image", "image", "featuredImage"]);
      if (fImg) featured_image = fImg;

      // For author avatar accept: author_avatar, avatar
      const aAvatar = getFilePath(["author_avatar", "avatar"]);
      if (aAvatar) {
        author = author || {};
        author.avatar = aAvatar;
      }
    }

    // Parse categories if sent as JSON string
    let categories = categoriesBody;
    if (categoriesBody && typeof categoriesBody === "string") {
      try {
        categories = JSON.parse(categoriesBody);
      } catch (e) {
        // allow comma-separated list
        categories = categoriesBody.split(",").map((c) => c.trim()).filter(Boolean);
      }
    }

    const newBlog = new Blog({
      title,
      content,
      author,
      featured_image,
      categories,
      published_date,
      is_published,
      is_featured
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error(error);
    // Return a structured error response so the client can see useful details
    const errPayload = {
      name: error && error.name,
      message: error && error.message,
      details: error && error.errors ? error.errors : undefined
    };
    res.status(500).json({ message: "Failed to create blog", error: errPayload });
  }
};


// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ created_at: -1 }); // latest first
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch blogs", error });
  }
};


// Get single blog by ID or slug
export const getBlogByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    let blog;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      blog = await Blog.findById(idOrSlug);
    } 
    if (!blog) {
      blog = await Blog.findOne({ slug: idOrSlug });
    }

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch blog", error });
  }
};


// Update blog by ID

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Build update object from incoming body and any uploaded files
    const {
      title,
      content,
      author: authorBody,
      featured_image: featuredImageBody,
      categories: categoriesBody,
      published_date,
      is_published,
      is_featured
    } = req.body || {};

    const update = {};
    if (title !== undefined) update.title = title;
    if (content !== undefined) update.content = content;
    if (published_date !== undefined) update.published_date = published_date;
    if (is_published !== undefined) update.is_published = is_published === "true" || is_published === true;
    if (is_featured !== undefined) update.is_featured = is_featured === "true" || is_featured === true;

    // Handle author field (allow JSON string or simple name)
    if (authorBody !== undefined) {
      let authorObj = {};
      if (typeof authorBody === "string") {
        try {
          authorObj = JSON.parse(authorBody);
        } catch (e) {
          authorObj = { name: authorBody };
        }
      } else {
        authorObj = authorBody;
      }
      update.author = authorObj;
    }

    // Parse categories if provided
    if (categoriesBody !== undefined) {
      let categories = categoriesBody;
      if (typeof categoriesBody === "string") {
        try {
          categories = JSON.parse(categoriesBody);
        } catch (e) {
          categories = categoriesBody.split(",").map((c) => c.trim()).filter(Boolean);
        }
      }
      update.categories = categories;
    }

    // Handle uploaded files (support req.files as array or object)
    if (req.files) {
      const getFilePath = (names) => {
        if (!req.files) return undefined;
        if (Array.isArray(req.files)) {
          const f = req.files.find((file) => names.includes(file.fieldname));
          return f ? f.path.replace(/\\/g, "/") : undefined;
        }
        for (const n of names) {
          if (req.files[n] && req.files[n][0]) return req.files[n][0].path.replace(/\\/g, "/");
        }
        return undefined;
      };

      const fImg = getFilePath(["featured_image", "image", "featuredImage"]);
      if (fImg) update.featured_image = fImg;

      const aAvatar = getFilePath(["author_avatar", "avatar"]);
      if (aAvatar) {
        // If author object is already being updated, set avatar on it, else set nested path
        if (update.author) {
          update.author.avatar = aAvatar;
        } else {
          update["author.avatar"] = aAvatar; // use dot notation to update nested field
        }
      }
    } else {
      // if no files but featured_image provided in body as path/value
      if (featuredImageBody !== undefined) update.featured_image = featuredImageBody;
    }

    // If no fields provided to update, return 400
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No updatable fields provided" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, update, { new: true });
    if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update blog", error });
  }
};


// Delete blog by ID

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete blog", error });
  }
};
