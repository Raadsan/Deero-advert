// frontend/services/achievementApi.ts
import api from "./axios"; // your axios instance

// ➕ CREATE ACHIEVEMENT
export const createAchievement = (data: any) => {
  return api.post("/achievements", data);
};

// 📄 GET ALL ACHIEVEMENTS
export const getAllAchievements = () => {
  return api.get("/achievements");
};

// 📄 GET ACHIEVEMENT BY ID
export const getAchievementById = (id: string) => {
  return api.get(`/achievements/${id}`);
};

// ✏️ UPDATE ACHIEVEMENT
export const updateAchievement = (id: string, data: any) => {
  return api.patch(`/achievements/${id}`, data);
};

// 🗑 DELETE ACHIEVEMENT
export const deleteAchievement = (id: string) => {
  return api.delete(`/achievements/${id}`);
};
