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
    return user?.role === "admin";
};

export const isUser = (): boolean => {
    const user = getUser();
    return user?.role === "user" || (!user?.role && isAuthenticated());
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

