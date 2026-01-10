export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace("/api", "");

export const getImageUrl = (path: string | undefined) => {
    if (!path || path === "") return null;
    if (path.startsWith("http")) return path;

    // Ensure path doesn't start with / if we're adding it
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    // Also handle 'uploads/' prefix if needed, but usually the backend returns it
    return `${API_BASE_URL}/${cleanPath}`.replace(/([^:]\/)\/+/g, "$1");
};
