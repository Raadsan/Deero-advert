// Authentication utility functions
// This implementation uses a "Session Cookie + LocalStorage" hybrid approach:
// 1. Data is stored in localStorage to be shared across tabs and handle large objects.
// 2. A session cookie (deero_session) is used to track the browser session.
// 3. When the browser is closed, the session cookie is deleted.
// 4. On the next open, we detect the missing cookie and clear localStorage.

const setSessionCookie = () => {
    if (typeof window === "undefined") return;
    document.cookie = "deero_session=active; path=/; SameSite=Lax";
};

const hasSessionCookie = (): boolean => {
    if (typeof window === "undefined") return false;
    return document.cookie.split(';').some((item) => item.trim().startsWith('deero_session='));
};

const clearSessionCookie = () => {
    if (typeof window === "undefined") return;
    document.cookie = "deero_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
};

const ensureSession = () => {
    if (typeof window === "undefined") return;
    if (!hasSessionCookie()) {
        // Browser was closed and reopened, or cookie was lost
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
};

export const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    ensureSession();
    return localStorage.getItem("token");
};

export const getUser = (): any | null => {
    if (typeof window === "undefined") return null;
    ensureSession();
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    try {
        return JSON.parse(userData);
    } catch (e) {
        return null;
    }
};

export const setAuth = (token: string, user: any): void => {
    if (typeof window === "undefined") return;
    setSessionCookie();
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};

export const isAuthenticated = (): boolean => {
    return !!getToken() && !!getUser();
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

export const refreshUser = async (): Promise<any | null> => {
    if (typeof window === "undefined" || !isAuthenticated()) return null;
    try {
        const { getMe } = await import("@/api-client/authApi");
        const res: any = await getMe();
        const latestUser = res.data;
        if (latestUser) {
            localStorage.setItem("user", JSON.stringify(latestUser));
            return latestUser;
        }
        return null;
    } catch (e) {
        console.error("Failed to refresh user data", e);
        return null;
    }
};

export const clearAuth = (): void => {
    if (typeof window === "undefined") return;
    clearSessionCookie();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};
