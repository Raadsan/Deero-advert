import api from "./axios";

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
  // Clear token and user from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Return a resolved promise for consistency
  return Promise.resolve();
};

// Reset Password
export const resetPassword = (token: string, password: string) => {
  return api.post(`/users/reset-password/${token}`, { password });
};

