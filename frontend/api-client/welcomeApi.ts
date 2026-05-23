import api from "./axios";

/* ➕ CREATE WELCOME MESSAGE */
export const createWelcomeMessage = (formData: FormData) => {
    return api.post("/welcome", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

/* 📥 GET ALL WELCOME MESSAGES */
export const getWelcomeMessages = () => {
    return api.get("/welcome");
};

/* 📥 GET SINGLE (ACTIVE) WELCOME MESSAGE */
export const getWelcomeMessage = () => {
    return api.get("/welcome/active");
};

/* 📥 GET BY ID */
export const getWelcomeMessageById = (id: string) => {
    return api.get(`/welcome/${id}`);
};

/* ✏ UPDATE WELCOME MESSAGE */
export const updateWelcomeMessage = (id: string, formData: FormData) => {
    return api.put(`/welcome/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

/* ❌ DELETE WELCOME MESSAGE */
export const deleteWelcomeMessage = (id: string) => {
    return api.delete(`/welcome/${id}`);
};
