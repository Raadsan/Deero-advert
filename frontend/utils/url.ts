const getBaseURL = () => {
    // 1. Prioritize environment variable
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL.replace("/api", "");
    }

    // 2. Client-side dynamic detection
    if (typeof window !== "undefined") {
        const { protocol, hostname } = window.location;
        
        // If on the domain (deeroadvert.so) or using HTTPS, use the Nginx proxy
        const isDomain = hostname.includes("deeroadvert.so");
        
        if (isDomain || protocol === "https:") {
            return `${protocol}//${hostname}`;
        }
        
        // Fallback for IP-based or local access (Backend is on port 8000)
        return `${protocol}//${hostname}:8000`;
    }

    return "http://localhost:8000";
};

export const API_BASE_URL = getBaseURL();

export const getImageUrl = (path: any) => {
    if (!path || typeof path !== "string" || path === "") return null;
    if (path.startsWith("http")) return path;

    // Normalize backslashes to forward slashes for Windows paths
    let cleanPath = path.replace(/\\/g, "/");

    // Ensure path doesn't start with / if we're adding it
    cleanPath = cleanPath.startsWith("/") ? cleanPath.substring(1) : cleanPath;

    // Auto-prepend uploads/ if likely missing (simple heuristic)
    if (!cleanPath.startsWith("uploads/") && !cleanPath.startsWith("images/")) {
        cleanPath = `uploads/${cleanPath}`;
    }

    // Also handle 'uploads/' prefix if needed, but usually the backend returns it
    return `${API_BASE_URL}/${cleanPath}`.replace(/([^:]\/)\/+/g, "$1");
};

export const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-');     // Replace multiple - with single -
};

