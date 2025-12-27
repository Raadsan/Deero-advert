// frontend/services/serviceApi.ts
import api from "./axios"; // your axios instance

// ➕ CREATE SERVICE (with FormData for file upload)
export const createService = (formData: FormData) => {
  return api.post("/service/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 📄 GET ALL SERVICES
export const getAllServices = () => {
  return api.get("/service");
};

// 📄 GET SERVICE BY ID
export const getServiceById = (id: string) => {
  return api.get(`/service/${id}`);
};

// ✏️ UPDATE SERVICE (with FormData for file upload)
export const updateService = (id: string, formData: FormData) => {
  return api.patch(`/service/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🗑 DELETE SERVICE
export const deleteService = (id: string) => {
  return api.delete(`/service/${id}`);
};
