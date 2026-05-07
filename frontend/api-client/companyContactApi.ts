import axiosInstance from "./axios";

export const getCompanyContacts = async () => {
    const response = await axiosInstance.get("/company-contact");
    return response.data;
};

export const createCompanyContact = async (data: { type: string; value: string }) => {
    const response = await axiosInstance.post("/company-contact", data);
    return response.data;
};

export const updateCompanyContact = async (id: number | string, data: { type: string; value: string }) => {
    const response = await axiosInstance.put(`/company-contact/${id}`, data);
    return response.data;
};

export const deleteCompanyContact = async (id: number | string) => {
    const response = await axiosInstance.delete(`/company-contact/${id}`);
    return response.data;
};

export const syncCompanyContacts = async (type: string, values: string[]) => {
    const response = await axiosInstance.post('/company-contact/sync', { type, values });
    return response.data;
};
