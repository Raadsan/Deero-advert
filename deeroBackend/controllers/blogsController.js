import { prisma } from "../lib/prisma.js";

const generateSlug = async (title) => {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let slugExists = await prisma.blog.findUnique({ where: { slug } });
  let count = 1;

  while (slugExists) {
    const newSlug = `${slug}-${count}`;
    slugExists = await prisma.blog.findUnique({ where: { slug: newSlug } });
    if (!slugExists) {
      slug = newSlug;
      break;
    }
    count++;
  }
  return slug;
};

// Create a new blog
export const addBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      author,
      published_date,
      featured_image: featuredImageBody
    } = req.body;

    let featured_image = featuredImageBody;
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
      if (fImg) featured_image = fImg;
    }

    const slug = await generateSlug(title);

    const savedBlog = await prisma.blog.create({
      data: {
        title,
        content,
        author,
        featuredImage: featured_image,
        publishedDate: published_date ? new Date(published_date) : null,
        slug
      }
    });

    res.status(201).json(savedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create blog", error: error.message });
  }
};

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch blogs", error: error.message });
  }
};

// Get single blog by ID or slug
export const getBlogByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    let blog;
    const id = parseInt(idOrSlug);
    if (!isNaN(id)) {
      blog = await prisma.blog.findUnique({ where: { id } });
    }
    
    if (!blog) {
      blog = await prisma.blog.findUnique({ where: { slug: idOrSlug } });
    }

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch blog", error: error.message });
  }
};

// Update blog by ID
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blogId = parseInt(id);

    const {
      title,
      content,
      author,
      published_date,
      featured_image: featuredImageBody
    } = req.body || {};

    const update = {};
    if (title !== undefined) {
        update.title = title;
        // Optionally update slug if title changes?
        // update.slug = await generateSlug(title); 
    }
    if (content !== undefined) update.content = content;
    if (author !== undefined) update.author = author;
    if (published_date !== undefined) update.publishedDate = new Date(published_date);

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
      if (fImg) update.featuredImage = fImg;
    } else {
      if (featuredImageBody !== undefined) update.featuredImage = featuredImageBody;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: update
    });

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update blog", error: error.message });
  }
};

// Delete blog by ID
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.blog.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete blog", error: error.message });
  }
};
