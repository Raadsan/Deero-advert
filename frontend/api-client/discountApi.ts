import api from "./axios";

export const createDiscount = (data: any) => api.post("/discounts", data);
export const getPublicDiscounts = (platform = "website") => 
  api.get("/discounts/public", { params: { platform } });
export const getAllDiscounts = (params?: any) => 
  api.get("/discounts", { params });
export const getDiscountByTarget = (targetType: string, targetId: string) => 
  api.get("/discounts/target", { params: { targetType, targetId } });
export const getUserDiscounts = (userId: string, platform = "website") => 
  api.get(`/discounts/user/${userId}`, { params: { platform } });
export const updateDiscount = (id: string | number, data: any) => 
  api.put(`/discounts/${id}`, data);
export const updateDiscountStatus = (id: string | number, status: string) => 
  api.put(`/discounts/${id}`, { status });
export const deleteDiscount = (id: string | number) => 
  api.delete(`/discounts/${id}`);
