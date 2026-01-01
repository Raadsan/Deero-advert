import api from "./axios";
import { MenuResponse } from "../types/menu";

/**
 * Get user menus based on role ID
 * @param roleId - The role ID of the user
 * @returns Promise with menu data
 */
export const getUserMenus = async (roleId: string): Promise<MenuResponse> => {
    const response = await api.get<MenuResponse>(`/menus/user/${roleId}`);
    return response.data;
};

/**
 * Get all menus (admin only)
 * @returns Promise with all menus
 */
export const getAllMenus = async (): Promise<MenuResponse> => {
    const response = await api.get<MenuResponse>("/menus");
    return response.data;
};
