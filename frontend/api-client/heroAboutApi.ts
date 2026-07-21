import axiosInstance from "./axios";

export const getHeroAbouts = async () => {
  const { data } = await axiosInstance.get("/hero-about");
  return data;
};

export const getActiveHeroAbout = async () => {
  const { data } = await axiosInstance.get("/hero-about/active");
  return data;
};

export const createHeroAbout = async (formData: FormData) => {
  const { data } = await axiosInstance.post("/hero-about", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateHeroAbout = async (id: number, formData: FormData) => {
  const { data } = await axiosInstance.put(`/hero-about/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteHeroAbout = async (id: number) => {
  const { data } = await axiosInstance.delete(`/hero-about/${id}`);
  return data;
};
