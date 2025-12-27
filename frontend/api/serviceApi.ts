// frontend/services/serviceApi.ts
import api from "./axios"; // your axios instance

// ➕ CREATE SERVICE
export const createService = (data: any) => {
  return api.post("/service", data);
};

// 📄 GET ALL SERVICES
export const getAllServices = () => {
  return api.get("/service");
};

// 📄 GET SERVICE BY ID
export const getServiceById = (id: string) => {
  return api.get(`/service/${id}`);
};

// ✏️ UPDATE SERVICE
export const updateService = (id: string, data: any) => {
  return api.patch(`/service/${id}`, data);
};

// 🗑 DELETE SERVICE
export const deleteService = (id: string) => {
  return api.delete(`/service/${id}`);
};
