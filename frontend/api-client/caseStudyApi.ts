import api from "./axios";

// ➕ CREATE CASE STUDY
export const createCaseStudy = (formData: FormData) => {
  return api.post("/casestudy", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 📄 GET ALL CASE STUDIES
export const getAllCaseStudies = () => {
  return api.get("/casestudy");
};

// 📄 GET CASE STUDY BY ID
export const getCaseStudyById = (id: string | number) => {
  return api.get(`/casestudy/${id}`);
};

// ✏️ UPDATE CASE STUDY
export const updateCaseStudy = (id: string | number, formData: FormData) => {
  return api.patch(`/casestudy/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🗑 DELETE CASE STUDY
export const deleteCaseStudy = (id: string | number) => {
  return api.delete(`/casestudy/${id}`);
};
