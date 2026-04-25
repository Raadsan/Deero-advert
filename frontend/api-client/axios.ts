import axios from "axios";
import { getToken, clearAuth } from "@/utils/auth";

const getBaseURL = () => {
    // 1. Prioritize the environment variable (Best for production)
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    // 2. Client-side dynamic detection
    if (typeof window !== "undefined") {
        const { protocol, hostname } = window.location;
        
        // If on the domain (deeroadvert.so) or using HTTPS, use the Nginx proxy
        const isDomain = hostname.includes("deeroadvert.so");
        
        if (isDomain || protocol === "https:") {
            return `${protocol}//${hostname}/api`;
        }
        
        // Fallback for IP-based or local access (Backend is on port 8000)
        return `${protocol}//${hostname}:8000/api`;
    }

    // 3. Server-side / Build-time default
    return "http://localhost:8000/api";
};

export const BASE_URL = getBaseURL();
export const UPLOAD_URL = BASE_URL.replace("/api", "/uploads");

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !error.config?.url?.includes("login")) {
            // Handle unauthorized access
            clearAuth();
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        // Enhance network errors
        if (error.message === "Network Error") {
            console.error("❌ Backend server might not be running or is unreachable.");
        }

        return Promise.reject(error);
    }
);

export default api;



