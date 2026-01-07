import api from "./axios";

// ➕ CREATE DOMAIN PRICE (JSON)
export const createDomainPrice = (data: any) => {
  return api.post("/domain-prices", data);
};

// 📄 GET ALL DOMAIN PRICES
export const getAllDomainPrices = () => {
  return api.get("/domain-prices");
};

// 📄 GET DOMAIN PRICE BY ID
export const getDomainPriceById = (id: string) => {
  return api.get(`/domain-prices/${id}`);
};

// ✏️ UPDATE DOMAIN PRICE (JSON)
export const updateDomainPrice = (id: string, data: any) => {
  return api.put(`/domain-prices/${id}`, data);
};

// 🗑 DELETE DOMAIN PRICE
export const deleteDomainPrice = (id: string) => {
  return api.delete(`/domain-prices/${id}`);
};
