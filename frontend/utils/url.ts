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

    // Normalize backslashes to forward slashes
    let cleanPath = path.replace(/\\/g, "/");

    // Remove "uploads/" from the start if it exists, because we'll add it via UPLOAD_URL
    if (cleanPath.startsWith("uploads/")) {
        cleanPath = cleanPath.replace("uploads/", "");
    }
    
    // Ensure no leading slash
    if (cleanPath.startsWith("/")) {
        cleanPath = cleanPath.substring(1);
    }

    // Use the domain and add /uploads/ manually to be 100% sure
    const baseUrl = getBaseURL(); // This returns https://deeroadvert.so
    return `${baseUrl}/uploads/${cleanPath}`;
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

