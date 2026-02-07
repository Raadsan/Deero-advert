import api from "./axios";

export interface MajorClient {
    _id: string;
    description: string;
    images: string[];
    createdAt?: string;
    updatedAt?: string;
}

export const getMajorClients = async () => {
    const response = await api.get("/majorclients");
    return response.data;
};

export const createMajorClient = async (formData: FormData) => {
    const response = await api.post("/majorclients", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteMajorClient = async (id: string) => {
    const response = await api.delete(`/majorclients/${id}`);
    return response.data;
};

