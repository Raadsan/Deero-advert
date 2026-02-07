import api from "./axios";

/* ➕ CREATE PORTFOLIO */
export const createPortfolio = (formData: FormData) => {
    return api.post("/portfolios", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

/* 📥 GET ALL PORTFOLIOS */
export const getPortfolios = () => {
    return api.get("/portfolios");
};

/* 📥 GET SINGLE PORTFOLIO BY ID */
export const getPortfolioById = (id: string) => {
    return api.get(`/portfolios/${id}`);
};

/* ✏ UPDATE PORTFOLIO */
export const updatePortfolio = (id: string, formData: FormData) => {
    return api.patch(`/portfolios/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

/* ❌ DELETE PORTFOLIO */
export const deletePortfolio = (id: string) => {
    return api.delete(`/portfolios/${id}`);
};

/* 🗑 DELETE SINGLE GALLERY IMAGE */
export const deleteGalleryImage = (id: string, imagePath: string) => {
    return api.delete(`/portfolios/${id}/gallery`, {
        data: { imagePath }
    });
};

