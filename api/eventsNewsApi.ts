import api from "./axios";

// ➕ CREATE Event / News
export const createEventNews = (data: {
  title: string;
  type: "event" | "news";
  date: string;
}) => {
  return api.post("/events-news", data);
};

// 📄 GET ALL Events & News
export const getAllEventsNews = () => {
  return api.get("/events-news");
};

// 📄 GET Event / News BY ID
export const getEventNewsById = (id: string) => {
  return api.get(`/events-news/${id}`);
};

// ✏️ UPDATE Event / News
export const updateEventNews = (
  id: string,
  data: {
    title: string;
    type: "event" | "news";
    date: string;
  }
) => {
  return api.patch(`/events-news/${id}`, data);
};

// 🗑 DELETE Event / News
export const deleteEventNews = (id: string) => {
  return api.delete(`/events-news/${id}`);
};
