export interface Service {
  _id: string;
  serviceTitle: string;
  serviceDescription: string;
  serviceIcon: string;
  packages?: {
    packageTitle: string;
    price: number;
    features: string[];
    _id?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

import axios from "@/api-client/axios";

export const getAllServices = (): Promise<any> => {
  return axios.get("/service");
};

export const getServiceById = async (id: string): Promise<Service> => {
  const response = await axios.get(`/service/${id}`);
  return response.data;
};

export const createService = async (formData: FormData) => {
  const response = await axios.post("/service/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateService = async (id: string, formData: FormData) => {
  const response = await axios.patch(`/service/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteService = async (id: string) => {
  const response = await axios.delete(`/service/${id}`);
  return response.data;
};

