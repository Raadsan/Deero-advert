// Authentication utility functions

export const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
};

export const getUser = (): any | null => {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    try {
        return JSON.parse(userData);
    } catch (e) {
        return null;
    }
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

export const isAdmin = (): boolean => {
    const user = getUser();
    return user?.role === "admin" || user?.role?.name === "admin";
};

export const isManager = (): boolean => {
    const user = getUser();
    return user?.role === "manager" || user?.role?.name === "manager";
};

export const isAdminOrManager = (): boolean => {
    return isAdmin() || isManager();
};

export const isUser = (): boolean => {
    const user = getUser();
    return (
        user?.role === "user" ||
        user?.role?.name === "user" ||
        (!user?.role && isAuthenticated())
    );
};

export const getUserRole = (): string | null => {
    const user = getUser();
    if (typeof user?.role === "object") {
        return user?.role?.name || null;
    }
    return user?.role || null;
};

export const getUserId = (): string | null => {
    const user = getUser();
    return user?.id || user?._id || null;
};

export const clearAuth = (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

