import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "https://deero-advert-production-c83e.up.railway.app/api";
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://deero-advert-production-c83e.up.railway.app/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
});



// Add token to requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

