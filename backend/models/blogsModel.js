import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    featured_image: {
      type: String,
      required: true
    },
    published_date: {
      type: Date
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

// Auto-generate slug from title and prevent duplicates
// Use async middleware and return a promise instead of calling `next()`.
blogSchema.pre("save", async function () {
  if (this.title && !this.slug) {
    let slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // check if slug already exists
    let slugExists = await mongoose.models.Blog.findOne({ slug });
    let count = 1;

    while (slugExists) {
      const newSlug = `${slug}-${count}`;
      slugExists = await mongoose.models.Blog.findOne({ slug: newSlug });
      if (!slugExists) {
        slug = newSlug;
        break;
      }
      count++;
    }

    this.slug = slug;
  }
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
