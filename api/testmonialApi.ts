// frontend/services/testimonialApi.ts
import api from "./axios"; // your axios instance

// ➕ CREATE TESTIMONIAL
export const createTestimonial = (data: any) => {
  return api.post("/testimonials", data);
};

// 📄 GET ALL TESTIMONIALS
export const getAllTestimonials = () => {
  return api.get("/testimonials");
};

// 📄 GET TESTIMONIAL BY ID
export const getTestimonialById = (id: string) => {
  return api.get(`/testimonials/${id}`);
};

// ✏️ UPDATE TESTIMONIAL
export const updateTestimonial = (id: string, data: any) => {
  return api.patch(`/testimonials/${id}`, data);
};

// 🗑 DELETE TESTIMONIAL
export const deleteTestimonial = (id: string) => {
  return api.delete(`/testimonials/${id}`);
};
