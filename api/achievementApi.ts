// frontend/services/achievementApi.ts
import api from "./axios"; // your axios instance

// ➕ CREATE ACHIEVEMENT (with FormData for file upload)
export const createAchievement = (formData: FormData) => {
  return api.post("/achievements", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 📄 GET ALL ACHIEVEMENTS
export const getAllAchievements = () => {
  return api.get("/achievements");
};

// 📄 GET ACHIEVEMENT BY ID
export const getAchievementById = (id: string) => {
  return api.get(`/achievements/${id}`);
};

// ✏️ UPDATE ACHIEVEMENT (with FormData for file upload)
export const updateAchievement = (id: string, formData: FormData) => {
  return api.patch(`/achievements/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🗑 DELETE ACHIEVEMENT
export const deleteAchievement = (id: string) => {
  return api.delete(`/achievements/${id}`);
};
