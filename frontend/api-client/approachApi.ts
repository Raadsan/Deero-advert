import api from "./axios";

export const getApproaches = () => api.get("/approaches").then(r => r.data);
export const getActiveApproaches = () => api.get("/approaches/active").then(r => r.data);
export const createApproach = (data: FormData) => api.post("/approaches", data).then(r => r.data);
export const updateApproach = (id: number, data: FormData) => api.put(`/approaches/${id}`, data).then(r => r.data);
export const deleteApproach = (id: number) => api.delete(`/approaches/${id}`).then(r => r.data);
