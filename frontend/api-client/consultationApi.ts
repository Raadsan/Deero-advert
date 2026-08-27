import api from "./axios";

export const createConsultation = (data: any) =>
  api.post("/consultations", data).then((r) => r.data);

export const getConsultations = () =>
  api.get("/consultations").then((r) => r.data);

export const updateConsultationStatus = (id: number, status: string) =>
  api.patch(`/consultations/${id}`, { status }).then((r) => r.data);

export const deleteConsultation = (id: number) =>
  api.delete(`/consultations/${id}`).then((r) => r.data);
