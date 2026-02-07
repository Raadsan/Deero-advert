// frontend/services/blogsApi.ts
import api from "./axios"; // your axios instance

// ➕ CREATE BLOG (with FormData for file uploads)
export const createBlog = (formData: FormData) => {
  return api.post("/blogs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 📄 GET ALL BLOGS
export const getAllBlogs = () => {
  return api.get("/blogs");
};

// 📄 GET BLOG BY ID
export const getBlogById = (id: string) => {
  return api.get(`/blogs/${id}`);
};

// ✏️ UPDATE BLOG (with FormData for file uploads)
export const updateBlog = (id: string, formData: FormData) => {
  return api.patch(`/blogs/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🗑 DELETE BLOG
export const deleteBlog = (id: string) => {
  return api.delete(`/blogs/${id}`);
};
