import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:5000/api";
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://deero-advert-production-c83e.up.railway.app/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
});



import { getToken, clearAuth } from "@/utils/auth";

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

// Handle 401 unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url?.includes("login")) {
      // Unauthorized - clear auth and redirect to login
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

