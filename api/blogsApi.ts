// frontend/services/blogsApi.ts
import api from "./axios"; // your axios instance

// ➕ CREATE BLOG
export const createBlog = (data: any) => {
  return api.post("/blogs", data);
};

// 📄 GET ALL BLOGS
export const getAllBlogs = () => {
  return api.get("/blogs");
};

// 📄 GET BLOG BY ID
export const getBlogById = (id: string) => {
  return api.get(`/blogs/${id}`);
};

// ✏️ UPDATE BLOG
export const updateBlog = (id: string, data: any) => {
  return api.patch(`/blogs/${id}`, data);
};

// 🗑 DELETE BLOG
export const deleteBlog = (id: string) => {
  return api.delete(`/blogs/${id}`);
};
