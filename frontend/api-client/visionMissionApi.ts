import api from "./axios";

export const getVisionMissions = () => api.get("/vision-mission").then(r => r.data);
export const getActiveVisionMissions = () => api.get("/vision-mission/active").then(r => r.data);
export const createVisionMission = (data: FormData) => api.post("/vision-mission", data).then(r => r.data);
export const updateVisionMission = (id: number, data: FormData) => api.put(`/vision-mission/${id}`, data).then(r => r.data);
export const deleteVisionMission = (id: number) => api.delete(`/vision-mission/${id}`).then(r => r.data);
