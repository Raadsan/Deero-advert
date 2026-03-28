import api from "./axios";

export interface DomainPriceRecord {
    _id: string;
    tld: string;
    price: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getAllDomainPrices = () => {
    return api.get("/domain-prices");
};

export const createDomainPrice = (data: { tld: string; price: number; isActive?: boolean }) => {
    return api.post("/domain-prices", data);
};

export const updateDomainPrice = (id: string, data: { tld?: string; price?: number; isActive?: boolean }) => {
    return api.put(`/domain-prices/${id}`, data);
};


export const deleteDomainPrice = (id: string) => {
    return api.delete(`/domain-prices/${id}`);
};

export const toggleDomainPriceStatus = (id: string) => {
    return api.patch(`/domain-prices/${id}/toggle-status`);
};
