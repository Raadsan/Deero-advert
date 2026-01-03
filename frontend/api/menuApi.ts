import api from "./axios";
import { MenuResponse } from "../types/menu";

/**
 * Get user menus based on role ID
 */
export const getUserMenus = async (roleId: string): Promise<MenuResponse> => {
    const response = await api.get<MenuResponse>(`/menus/user/${roleId}`);
    return response.data;
};

/**
 * Get all menus
 */
export const getAllMenus = async (): Promise<MenuResponse> => {
    const response = await api.get<MenuResponse>("/menus");
    return response.data;
};

/**
 * Get menu by ID
 */
export const getMenuById = async (id: string): Promise<MenuResponse> => {
    const response = await api.get<MenuResponse>(`/menus/${id}`);
    return response.data;
};

/**
 * Create new menu
 */
export const createMenu = async (data: {
    title: string;
    icon?: string;
    url?: string;
    isCollapsible: boolean;
    subMenus?: Array<{ title: string; url: string }>;
}): Promise<MenuResponse> => {
    const response = await api.post<MenuResponse>("/menus", data);
    return response.data;
};

/**
 * Update menu
 */
export const updateMenu = async (
    id: string,
    data: {
        title?: string;
        icon?: string;
        url?: string;
        isCollapsible?: boolean;
        subMenus?: Array<{ _id?: string; title: string; url: string }>;
    }
): Promise<MenuResponse> => {
    const response = await api.patch<MenuResponse>(`/menus/${id}`, data);
    return response.data;
};

/**
 * Delete menu
 */
export const deleteMenu = async (id: string): Promise<MenuResponse> => {
    const response = await api.delete<MenuResponse>(`/menus/${id}`);
    return response.data;
};
