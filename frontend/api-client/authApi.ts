import api from "./axios";
import { clearAuth } from "@/utils/auth";

// Login
export const loginUser = (data: { email: string; password: string }) => {
  return api.post("/users/login", data);
};

// Signup
export const signupUser = (data: {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  companyName?: string;
  streetAddress?: string;
  streetAddress2?: string;
  city?: string;
  state?: string;
  country?: string;
}) => {
  return api.post("/users/signup", data);
};

// Forgot Password
export const forgotPassword = (email: string) => {
  return api.post("/users/forgot-password", { email });
};

// Logout
export const logout = () => {
  // Clear token and user from auth utility
  clearAuth();
  // Return a resolved promise for consistency
  return Promise.resolve();
};

// Verify Reset Code
export const verifyResetCode = (email: string, code: string) => {
  return api.post("/users/verify-reset-code", { email, code });
};

// Reset Password
export const resetPassword = (data: { email: string; code: string; password: string }) => {
  return api.post("/users/reset-password", data);
};

// Get current user profile (latest data)
export const getMe = () => {
  return api.get("/users/me");
};


