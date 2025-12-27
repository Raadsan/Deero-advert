import api from "./axios";

// Login
export const loginUser = (data: { email: string; password: string }) => {
  return api.post("/auth/login", data);
};

// Signup
export const signupUser = (data: { fullname: string; email: string; phone: string; password: string }) => {
  return api.post("/auth/signup", data);
};

// Forgot Password
export const forgotPassword = (email: string) => {
  return api.post("/auth/forgot-password", { email });
};

// Logout
export const logout = () => {
  // Clear token and user from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Return a resolved promise for consistency
  return Promise.resolve();
};

