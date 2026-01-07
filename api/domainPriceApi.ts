import api from "./axios";

// ➕ CREATE DOMAIN PRICE (FormData)
export const createDomainPrice = (formData: FormData) => {
  return api.post("/domain-prices", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 📄 GET ALL DOMAIN PRICES
export const getAllDomainPrices = () => {
  return api.get("/domain-prices");
};

// 📄 GET DOMAIN PRICE BY ID
export const getDomainPriceById = (id: string) => {
  return api.get(`/domain-prices/${id}`);
};

// ✏️ UPDATE DOMAIN PRICE (FormData)
export const updateDomainPrice = (id: string, formData: FormData) => {
  return api.put(`/domain-prices/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🗑 DELETE DOMAIN PRICE
export const deleteDomainPrice = (id: string) => {
  return api.delete(`/domain-prices/${id}`);
};
