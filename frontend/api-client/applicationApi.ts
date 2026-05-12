import axiosInstance from "./axios";

export interface JobApplication {
    _id?: string;
    fullName: string;
    position: string;
    phone: string;
    email: string;
    cvUrl: string;
    portfolioUrl?: string;
    certificateUrl?: string;
    status?: string;
    careerId?: string;
    createdAt?: string;
}

export const submitApplication = (data: JobApplication) => {
    return axiosInstance.post("/applications", data);
};

export const getAllApplications = () => {
    return axiosInstance.get("/applications");
};

export const updateApplicationStatus = (id: string, status: string) => {
    return axiosInstance.patch(`/applications/${id}/status`, { status });
};

export const deleteApplication = (id: string) => {
    return axiosInstance.delete(`/applications/${id}`);
};
