import axiosInstance from "./axios";

export const getHeroHomes = async () => {
  const { data } = await axiosInstance.get("/hero-home");
  return data;
};

export const getActiveHeroHomes = async () => {
  const { data } = await axiosInstance.get("/hero-home/active");
  return data;
};

export const createHeroHome = async (formData: FormData) => {
  const { data } = await axiosInstance.post("/hero-home", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateHeroHome = async (id: number, formData: FormData) => {
  const { data } = await axiosInstance.put(`/hero-home/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteHeroHome = async (id: number) => {
  const { data } = await axiosInstance.delete(`/hero-home/${id}`);
  return data;
};
