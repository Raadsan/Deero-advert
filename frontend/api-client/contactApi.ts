import api from "./axios";

export interface ContactData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

// ➕ CREATE CONTACT (Send Message)
export const createContact = (data: ContactData) => {
    return api.post("/contact", data);
};

// 📄 GET ALL CONTACT MESSAGES (Admin)
export const getAllContacts = () => {
    return api.get("/contact");
};

// 📄 GET CONTACT BY ID
export const getContactById = (id: string) => {
    return api.get(`/contact/${id}`);
};

// 🗑 DELETE CONTACT MESSAGE
export const deleteContact = (id: string) => {
    return api.delete(`/contact/${id}`);
};

