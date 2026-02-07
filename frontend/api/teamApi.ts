import api from "./axios";

/* ➕ CREATE TEAM */
export const createTeam = (formData: FormData) => {
    return api.post("/teams", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

/* 📥 GET ALL TEAMS */
export const getTeams = () => {
    return api.get("/teams");
};

/* ✏ UPDATE TEAM */
export const updateTeam = (id: string, formData: FormData) => {
    return api.put(`/teams/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

/* ❌ DELETE TEAM */
export const deleteTeam = (id: string) => {
    return api.delete(`/teams/${id}`);
};
