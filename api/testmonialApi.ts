// frontend/services/testimonialApi.ts
import api from "./axios"; // your axios instance

// ➕ CREATE TESTIMONIAL (with FormData for file upload)
export const createTestimonial = (formData: FormData) => {
  return api.post("/testimonials", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 📄 GET ALL TESTIMONIALS
export const getAllTestimonials = () => {
  return api.get("/testimonials");
};

// 📄 GET TESTIMONIAL BY ID
export const getTestimonialById = (id: string) => {
  return api.get(`/testimonials/${id}`);
};

// ✏️ UPDATE TESTIMONIAL (with FormData for file upload)
export const updateTestimonial = (id: string, formData: FormData) => {
  return api.patch(`/testimonials/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🗑 DELETE TESTIMONIAL
export const deleteTestimonial = (id: string) => {
  return api.delete(`/testimonials/${id}`);
};
