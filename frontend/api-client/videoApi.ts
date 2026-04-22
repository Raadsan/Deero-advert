import api from "./axios";

// ➕ CREATE VIDEO (with FormData for file uploads)
export const createVideo = (formData: FormData) => {
  return api.post("/videos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 📄 GET ALL VIDEOS
export const getAllVideos = () => {
  return api.get("/videos");
};

// 📄 GET VIDEO BY ID
export const getVideoById = (id: string | number) => {
  return api.get(`/videos/${id}`);
};

// ✏️ UPDATE VIDEO (with FormData for file uploads)
export const updateVideo = (id: string | number, formData: FormData) => {
  return api.patch(`/videos/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🗑 DELETE VIDEO
export const deleteVideo = (id: string | number) => {
  return api.delete(`/videos/${id}`);
};
