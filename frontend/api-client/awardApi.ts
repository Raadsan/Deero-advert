import api from "./axios";

export const getAwards = () => api.get("/awards").then(r => r.data);
export const getActiveAwards = () => api.get("/awards/active").then(r => r.data);
export const createAward = (data: FormData) => api.post("/awards", data).then(r => r.data);
export const updateAward = (id: number, data: FormData) => api.put(`/awards/${id}`, data).then(r => r.data);
export const deleteAward = (id: number) => api.delete(`/awards/${id}`).then(r => r.data);
