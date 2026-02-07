import api from "./axios";

export interface Career {
    _id: string;
    title: string;
    type: "Full-time" | "Part-time" | "Internship";
    location: string;
    description: string;
    postedDate: string;
    expireDate: string;
    isActive?: boolean;
    createdAt: string;
    updatedAt: string;
}

// Create career
export const createCareer = (data: Partial<Career>) => {
    return api.post("/careers", data);
};

// Get all careers
export const getAllCareers = () => {
    return api.get("/careers");
};

// Get active careers only
export const getActiveCareers = () => {
    return api.get("/careers/active");
};

// Get career by ID
export const getCareerById = (id: string) => {
    return api.get(`/careers/${id}`);
};

// Update career
export const updateCareer = (id: string, data: Partial<Career>) => {
    return api.patch(`/careers/${id}`, data);
};

// Delete career
export const deleteCareer = (id: string) => {
    return api.delete(`/careers/${id}`);
};

