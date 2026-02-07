import api from "./axios";

export interface RolePermission {
    _id: string;
    role: {
        _id: string;
        name: string;
        description?: string;
    };
    menusAccess: Array<{
        _id: string;
        menuId: {
            _id: string;
            title: string;
            icon?: string;
            url?: string;
            isCollapsible: boolean;
        };
        subMenus: Array<{
            _id: string;
            subMenuId: string;
        }>;
    }>;
    createdAt?: string;
    updatedAt?: string;
}

export interface RolePermissionResponse {
    success: boolean;
    permission?: RolePermission;
    permissions?: RolePermission[];
    message?: string;
}

/**
 * Get all role permissions
 */
export const getAllRolePermissions = async (): Promise<RolePermissionResponse> => {
    const response = await api.get<RolePermissionResponse>("/rolepermissions");
    return response.data;
};

/**
 * Get permissions by role ID
 */
export const getPermissionsByRole = async (roleId: string): Promise<RolePermissionResponse> => {
    const response = await api.get<RolePermissionResponse>(`/rolepermissions/role/${roleId}`);
    return response.data;
};

/**
 * Create or update role permissions
 */
export const createOrUpdatePermissions = async (data: {
    role: string;
    menusAccess: Array<{
        menuId: string;
        subMenus?: Array<{ subMenuId: string }>;
    }>;
}): Promise<RolePermissionResponse> => {
    const response = await api.post<RolePermissionResponse>("/rolepermissions", data);
    return response.data;
};

/**
 * Delete role permissions
 */
export const deleteRolePermissions = async (id: string): Promise<RolePermissionResponse> => {
    const response = await api.delete<RolePermissionResponse>(`/rolepermissions/${id}`);
    return response.data;
};

