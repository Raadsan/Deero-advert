import api from "./axios";

export interface HostingPackage {
    _id: string;
    name: string;
    desc?: string;
    price: number;
    pudgeText?: string;
    features: string[];
}

export const getAllPackages = () => {
    return api.get("/hosting");
};

export const createPackage = (data: any) => {
    return api.post("/hosting", data);
};

export const updatePackage = (id: string, data: any) => {
    return api.patch(`/hosting/${id}`, data);
};

export const deletePackage = (id: string) => {
    return api.delete(`/hosting/${id}`);
};
