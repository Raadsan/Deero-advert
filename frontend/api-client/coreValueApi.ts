import api from "./axios";

export const getCoreValues = () => api.get("/core-values").then(r => r.data);
export const getActiveCoreValues = () => api.get("/core-values/active").then(r => r.data);
export const createCoreValue = (data: FormData) => api.post("/core-values", data).then(r => r.data);
export const updateCoreValue = (id: number, data: FormData) => api.put(`/core-values/${id}`, data).then(r => r.data);
export const deleteCoreValue = (id: number) => api.delete(`/core-values/${id}`).then(r => r.data);
