// frontend/services/announcementApi.ts
import api from "./axios"; // your axios instance

export interface Announcement {
    _id: string;
    title: string;
    message: string;
    recipients: Array<{
        _id: string;
        fullname: string;
        email: string;
    }>;
    sendEmail: boolean;
    sentAt?: string;
    createdBy: {
        _id: string;
        fullname: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

// ➕ CREATE ANNOUNCEMENT
export const createAnnouncement = (data: {
    title: string;
    message: string;
    sendEmail?: boolean;
    recipients?: string[];
}) => {
    return api.post("/announcements", data);
};

// 📄 GET ALL ANNOUNCEMENTS
export const getAllAnnouncements = () => {
    return api.get("/announcements");
};

// 📄 GET ANNOUNCEMENT BY ID
export const getAnnouncementById = (id: string) => {
    return api.get(`/announcements/${id}`);
};

// 🗑 DELETE ANNOUNCEMENT
export const deleteAnnouncement = (id: string) => {
    return api.delete(`/announcements/${id}`);
};
