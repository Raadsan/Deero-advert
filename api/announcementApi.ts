import api from "./axios";

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

export interface AnnouncementResponse {
    success: boolean;
    data?: Announcement | Announcement[];
    message?: string;
}

/**
 * Get all announcements
 */
export const getAllAnnouncements = async (): Promise<AnnouncementResponse> => {
    const response = await api.get<AnnouncementResponse>("/announcements");
    return response.data;
};

/**
 * Create or broadcast announcement
 */
export const createAnnouncement = async (data: {
    title: string;
    message: string;
    sendEmail?: boolean;
    recipients?: string[];
}): Promise<AnnouncementResponse> => {
    const response = await api.post<AnnouncementResponse>("/announcements", data);
    return response.data;
};

/**
 * Get announcement by ID
 */
export const getAnnouncementById = async (id: string): Promise<AnnouncementResponse> => {
    const response = await api.get<AnnouncementResponse>(`/announcements/${id}`);
    return response.data;
};

/**
 * Delete announcement
 */
export const deleteAnnouncement = async (id: string): Promise<AnnouncementResponse> => {
    const response = await api.delete<AnnouncementResponse>(`/announcements/${id}`);
    return response.data;
};
