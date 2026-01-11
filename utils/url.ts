export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace("/api", "");

export const getImageUrl = (path: string | undefined) => {
    if (!path || path === "") return null;
    if (path.startsWith("http")) return path;

    // Ensure path doesn't start with / if we're adding it
    let cleanPath = path.startsWith("/") ? path.substring(1) : path;

    // Auto-prepend uploads/ if likely missing (simple heuristic)
    if (!cleanPath.startsWith("uploads/") && !cleanPath.startsWith("images/")) {
        cleanPath = `uploads/${cleanPath}`;
    }

    // Also handle 'uploads/' prefix if needed, but usually the backend returns it
    return `${API_BASE_URL}/${cleanPath}`.replace(/([^:]\/)\/+/g, "$1");
};
