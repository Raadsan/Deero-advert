import api from "./axios";

export interface Role {
    _id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface RoleResponse {
    success: boolean;
    role?: Role;
    roles?: Role[];
}

/**
 * Get all roles
 */
export const getAllRoles = async (): Promise<RoleResponse> => {
    const response = await api.get<RoleResponse>("/roles");
    return response.data;
};

/**
 * Get role by ID
 */
export const getRoleById = async (id: string): Promise<RoleResponse> => {
    const response = await api.get<RoleResponse>(`/roles/${id}`);
    return response.data;
};

/**
 * Create new role
 */
export const createRole = async (data: { name: string; description?: string }): Promise<RoleResponse> => {
    const response = await api.post<RoleResponse>("/roles", data);
    return response.data;
};

/**
 * Update role
 */
export const updateRole = async (id: string, data: { name?: string; description?: string }): Promise<RoleResponse> => {
    const response = await api.put<RoleResponse>(`/roles/${id}`, data);
    return response.data;
};

/**
 * Delete role
 */
export const deleteRole = async (id: string): Promise<RoleResponse> => {
    const response = await api.delete<RoleResponse>(`/roles/${id}`);
    return response.data;
};

