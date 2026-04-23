import api from "./axios";

export const createDiscount = (data: any) => api.post("/discounts", data);
export const getAllDiscounts = () => api.get("/discounts");
export const getUserDiscounts = (userId: string) => api.get(`/discounts/user/${userId}`);
export const updateDiscountStatus = (id: string, status: string) => api.put(`/discounts/${id}`, { status });
export const deleteDiscount = (id: string) => api.delete(`/discounts/${id}`);
