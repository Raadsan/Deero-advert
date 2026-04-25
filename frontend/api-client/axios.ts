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
    
    // Check if we are accessing via IP or localhost
    const isIPOrLocal = hostname === "localhost" || hostname === "127.0.0.1" || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

    if (isIPOrLocal) {
      // If using IP address, we must use port 8000
      return `${protocol}//${hostname}:8000/api`;
    } else {
      // If using a domain (deeroadvert.so), use the Nginx proxy at /api
      return `${protocol}//${hostname}/api`;
    }
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

// Add token to requests
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

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Unauthorized - clear auth and redirect to login
    if (error.response?.status === 401 && !error.config?.url?.includes("login")) {
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


