import api from "./axios";

// ➕ CREATE USER
export const createUser = (data: any) => {
  return api.post("/users", data);
};

// 📄 GET ALL USERS
export const getAllUsers = () => {
  return api.get("/users");
};

// 📄 GET USER BY ID
export const getUserById = (id: string) => {
  return api.get(`/users/${id}`);
};

// ✏️ UPDATE USER
export const updateUser = (id: string, data: any) => {
  return api.patch(`/users/${id}`, data);
};

// 🗑 DELETE USER
export const deleteUser = (id: string) => {
  return api.delete(`/users/${id}`);
};

