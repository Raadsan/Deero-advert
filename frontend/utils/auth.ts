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
    window.dispatchEvent(new Event("auth-change"));
};

export const isAuthenticated = (): boolean => {
    return !!getToken() && !!getUser();
};

export const getRoleName = (): string => {
    const user = getUser();
    if (typeof user?.role === "object") {
        return (user?.role?.name || "user").toLowerCase().trim();
    }
    return (user?.role || "user").toString().toLowerCase().trim();
};

export const isAdmin = (): boolean => getRoleName() === "admin";

export const isManager = (): boolean => getRoleName() === "manager";

export const isAdminOrManager = (): boolean => {
    const role = getRoleName();
    return role === "admin" || role === "manager";
};

export const isStaff = (): boolean => isAuthenticated() && getRoleName() !== "user";

export const isUser = (): boolean => {
    if (!isAuthenticated()) return false;
    return getRoleName() === "user";
};

export const getUserRole = (): string | null => {
    const role = getRoleName();
    return role || null;
};

const STAFF_ROUTE_ALIASES: Record<string, string> = {
    "/services": "/management/services",
    "/teams": "/management/teams",
    "/blogs": "/management/blogs",
    "/portfolio": "/management/portfolio",
    "/portfolios": "/management/portfolio",
    "/achievements": "/management/achievements",
    "/testimonials": "/management/testimonials",
    "/career": "/management/career",
    "/careers": "/management/career",
    "/announcements": "/management/announcements",
    "/events-news": "/management/events-news",
    "/video": "/management/video",
    "/videos": "/management/video",
    "/majorclient": "/management/majorclient",
    "/major-clients": "/management/majorclient",
    "/hosting": "/management/hosting-package",
    "/hosting-package": "/management/hosting-package",
    "/domain-price": "/management/domain-price",
    "/case-study": "/management/case-study",
    "/casestudy": "/management/case-study",
    "/welcome": "/management/welcome-message",
    "/company-contact": "/management/company-contact",
    "/users": "/config/users",
    "/roles": "/config/roles",
    "/menus": "/config/menus",
    "/permissions": "/config/permissions",
};

export const normalizeStaffMenuUrl = (url?: string) => {
    if (!url) return "#";

    let clean = url.replace(/\\/g, "/").trim();
    if (!clean.startsWith("/")) clean = `/${clean}`;
    clean = clean.replace(/\/+$/, "") || "/";

    if (clean === "/") return "/dashboard";

    if (
        clean.startsWith("/management") ||
        clean.startsWith("/config") ||
        clean.startsWith("/requests") ||
        clean.startsWith("/request") ||
        clean.startsWith("/discounts") ||
        clean.startsWith("/dashboard") ||
        clean.startsWith("/payments")
    ) {
        return clean;
    }

    return STAFF_ROUTE_ALIASES[clean] || clean;
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
    window.dispatchEvent(new Event("auth-change"));
};
